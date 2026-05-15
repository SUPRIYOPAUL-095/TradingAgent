'use client'

import { useState } from 'react'
import { AnalysisForm, DashboardCards, ChartSection } from '@/components'
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
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalysis = async (company: string, date: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`https://tradingagent-yndk.onrender.com/analyze?symbol=${company}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status}`)
      }

      const data = await response.json()

      const analysisResult: AnalysisResult = {
        company_symbol: data.symbol || company,
        analysis_date: date,
        decision: (data.signal as 'BUY' | 'SELL' | 'HOLD') || 'HOLD',
        confidence: data.rsi ? (data.rsi > 70 || data.rsi < 30 ? 85 : 65) : 75,
        risk: data.rsi ? (data.rsi > 80 || data.rsi < 20 ? 'High' : 'Medium') : 'Medium',
        explanation: data.summary || 'No detailed analysis summary provided.',
        rsi: data.rsi,
        sma20: data.sma20,
        sma50: data.sma50,
      }

      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trading Dashboard</h1>
          <p className="text-slate-400">Gemini AI Analysis & Trading Recommendations</p>
        </div>

        {/* Analysis Form */}
        <AnalysisForm onSubmit={handleAnalysis} loading={loading} />

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
            />

            <ChartSection />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Stock Symbol</p>
                <p className="text-2xl font-bold text-white">{result.company_symbol}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">RSI (14)</p>
                <p className="text-2xl font-bold text-blue-400">{result.rsi}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">SMA (20)</p>
                <p className="text-2xl font-bold text-cyan-400">{result.sma20}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">SMA (50)</p>
                <p className="text-2xl font-bold text-indigo-400">{result.sma50}</p>
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
