'use client'

import { useState } from 'react'
import { Header, AnalysisForm, DashboardCards, ChartSection } from '@/components'
import { isErrorSummary, generateLocalSummary, formatNumber } from '@/lib/utils'
import {
  Zap,
  TrendingUp,
} from 'lucide-react'

interface AnalysisResult {
  decision: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  risk: 'Low' | 'Medium' | 'High'
  explanation: string
  company_symbol: string
  analysis_date: string
  rsi: number
  sma20: number
  sma50: number
  latestPrice: number
  summarySource: 'gemini' | 'local'
  history: Array<{ date: string; price: number }>
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalysis = async (company: string, date: string) => {
    setLoading(true)
    setError('')

    let retries = 0;
    const maxRetries = 5;
    let data: any = null;
    let fallbackData: any = null;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(`https://tradingagent-yndk.onrender.com/analyze?symbol=${company}&date=${date}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })

        // Try to parse JSON. It might contain partial technical data even if there's an error.
        const json = await response.json().catch(() => null)
        
        if (json && typeof json.rsi === 'number') {
            fallbackData = json;
        }

        if (!response.ok) {
            throw new Error(`Backend Error: ${response.status}`)
        }

        if (!json) {
            throw new Error('Invalid JSON response')
        }
        
        if (json.error) {
            throw new Error(json.error)
        }

        data = json;
        break; // Success
      } catch (err: any) {
        retries++;
        if (retries <= maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    try {
        if (!data && fallbackData) {
            data = fallbackData;
        }

        if (!data) {
            data = {
                symbol: company,
                date: date,
                signal: 'HOLD',
                rsi: 50,
                sma20: 0,
                sma50: 0,
                latest_price: 0,
                summary_source: 'local'
            }
        }

        const signal = (data.signal as 'BUY' | 'SELL' | 'HOLD') || 'HOLD'
        let explanation = data.summary || data.error || ''
        let summarySource: 'gemini' | 'local' = data.summary_source || 'gemini'

        if (isErrorSummary(explanation) || data.error || (!data.summary && summarySource !== 'local')) {
            explanation = generateLocalSummary({
                symbol: data.symbol || company,
                rsi: data.rsi || 50,
                sma20: data.sma20 || 0,
                sma50: data.sma50 || 0,
                signal: signal,
                latestPrice: data.latest_price,
            })
            summarySource = 'local'
        }

        const analysisResult: AnalysisResult = {
            company_symbol: data.symbol || company,
            analysis_date: data.date || date,
            decision: signal,
            confidence: data.rsi ? (data.rsi > 70 || data.rsi < 30 ? 85 : 65) : 75,
            risk: data.rsi ? (data.rsi > 80 || data.rsi < 20 ? 'High' : 'Medium') : 'Medium',
            explanation: explanation,
            rsi: data.rsi || 50,
            sma20: data.sma20 || 0,
            sma50: data.sma50 || 0,
            latestPrice: data.latest_price || 0,
            summarySource: summarySource,
            history: data.history || []
        }

        setResult(analysisResult)
    } catch (err) {
      // Graceful fallback to prevent exposing raw errors
      setError('Analysis could not be completed at this time.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Header />

        {/* Analysis Form */}
        <AnalysisForm onSubmit={handleAnalysis} loading={loading} />

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="text-red-500 text-2xl">⚠</div>
            <div>
              <h3 className="text-red-400 font-bold mb-1">Analysis Failed</h3>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-white font-medium">Gemini is analyzing market data...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <DashboardCards
              decision={result.decision}
              confidence={result.confidence}
              risk={result.risk}
              explanation={result.explanation}
              rsi={result.rsi}
              sma20={result.sma20}
              sma50={result.sma50}
              companySymbol={result.company_symbol}
              latestPrice={result.latestPrice}
              summarySource={result.summarySource}
            />

            <ChartSection data={result.history} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Stock Symbol</p>
                <p className="text-2xl font-bold text-white">{result.company_symbol}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Analysis Date</p>
                <p className="text-2xl font-bold text-blue-400">{result.analysis_date}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">SMA (20)</p>
                <p className="text-2xl font-bold text-cyan-400">{formatNumber(result.sma20)}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">SMA (50)</p>
                <p className="text-2xl font-bold text-indigo-400">{formatNumber(result.sma50)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📈</div>
            <h2 className="text-3xl font-bold text-white mb-3">AI Trading Analysis</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto">
              Enter a stock symbol to get real-time technical analysis and trading recommendations powered by Google Gemini.
            </p>
          </div>
        )}
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
