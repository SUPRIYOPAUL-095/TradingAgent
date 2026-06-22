'use client'

import { useState } from 'react'
import { AnalysisForm, DashboardCards, ChartSection } from '@/components'
import { Zap, TrendingUp, Cpu, Info, ShieldAlert, CheckCircle2, LineChart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  history: Array<{ date: string; price: number }>
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalysis = async (company: string, date: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`https://tradingagent-yndk.onrender.com/analyze?symbol=${company}&date=${date}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Status ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Safeguard historical data structure
      const formattedHistory = (data.history || []).map((h: any) => ({
        date: h.date || '',
        price: Number(h.price) || 0
      }))

      const analysisResult: AnalysisResult = {
        company_symbol: data.symbol || company,
        analysis_date: data.date || date,
        decision: (data.signal as 'BUY' | 'SELL' | 'HOLD') || 'HOLD',
        confidence: data.rsi ? (data.rsi > 70 || data.rsi < 30 ? 85 : 65) : 75,
        risk: data.rsi ? (data.rsi > 80 || data.rsi < 20 ? 'High' : 'Medium') : 'Medium',
        explanation: data.summary || 'No detailed analysis summary provided.',
        rsi: Number(Number(data.rsi).toFixed(2)) || 50,
        sma20: Number(Number(data.sma20).toFixed(2)) || 0,
        sma50: Number(Number(data.sma50).toFixed(2)) || 0,
        history: formattedHistory
      }

      setResult(analysisResult)
    } catch (err) {
      setError('Unable to fetch stock data right now. Please verify the symbol or try again shortly.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Quantum Terminal</h2>
          <p className="text-xs text-slate-400">Gemini AI Model-driven Quant and Sentiment Analysis</p>
        </div>
      </div>

      {/* Inputs Form Section */}
      <AnalysisForm onSubmit={handleAnalysis} loading={loading} />

      {/* Main Panel Viewport */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* Error Alert Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel border-rose-500/20 bg-rose-500/5 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-400">Request Error</h3>
                <p className="text-xs text-rose-300/80 leading-normal mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Skeleton Loaders (Active Processing State) */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Three KPI Cards Skeletons */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-panel border-slate-900/60 rounded-2xl p-6 h-36 relative overflow-hidden">
                    <div className="shimmer h-3 w-20 rounded mb-4" />
                    <div className="shimmer h-7 w-32 rounded mb-2.5" />
                    <div className="shimmer h-2 w-full rounded" />
                  </div>
                ))}
              </div>

              {/* Chart Panel Skeleton */}
              <div className="glass-panel border-slate-900/60 rounded-2xl p-6 h-96 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <div className="shimmer h-4 w-36 rounded" />
                    <div className="shimmer h-3 w-56 rounded" />
                  </div>
                  <div className="shimmer h-7 w-20 rounded" />
                </div>
                <div className="shimmer w-full h-56 rounded-xl" />
              </div>

              {/* Explanation Loader */}
              <div className="glass-panel border-slate-900/60 rounded-2xl p-6 relative overflow-hidden">
                <div className="shimmer h-4 w-40 rounded mb-4" />
                <div className="space-y-2">
                  <div className="shimmer h-3 w-full rounded" />
                  <div className="shimmer h-3 w-[90%] rounded" />
                  <div className="shimmer h-3 w-[95%] rounded" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Output */}
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Metrics block */}
              <DashboardCards
                decision={result.decision}
                confidence={result.confidence}
                risk={result.risk}
                explanation={result.explanation}
                rsi={result.rsi}
                sma20={result.sma20}
                sma50={result.sma50}
              />

              {/* Chart block */}
              <ChartSection data={result.history} />

              {/* Extended breakdown grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel rounded-xl p-5 border border-slate-900/40">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Stock Ticker</p>
                  <p className="text-lg font-mono font-bold text-white">{result.company_symbol}</p>
                </div>
                <div className="glass-panel rounded-xl p-5 border border-slate-900/40">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Execution Date</p>
                  <p className="text-lg font-mono font-bold text-blue-400">{result.analysis_date}</p>
                </div>
                <div className="glass-panel rounded-xl p-5 border border-slate-900/40">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">SMA (20)</p>
                  <p className="text-lg font-mono font-bold text-cyan-400">₹{result.sma20 ? result.sma20.toLocaleString('en-IN') : 'N/A'}</p>
                </div>
                <div className="glass-panel rounded-xl p-5 border border-slate-900/40">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">SMA (50)</p>
                  <p className="text-lg font-mono font-bold text-purple-400">₹{result.sma50 ? result.sma50.toLocaleString('en-IN') : 'N/A'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Onboarding / On Landing Screen View */}
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-panel rounded-2xl p-8 lg:p-12 text-center border border-slate-900/60 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative radial gradients */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-xl mx-auto space-y-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/10">
                  <LineChart size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
                    Run Technical AI Synthesis
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provide a valid NSE ticker symbol (e.g., <code className="font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded text-[11px]">RELIANCE.NS</code>) and historical query date above to trigger full backtest analysis, pricing gradients, and Gemini LLM trading recommendation insights.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 text-left">
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Live NSE Feeds</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Streams live Indian market feeds and indexes for processing.</p>
                  </div>
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>Indicator Math</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Calculates precise RSI metrics, SMA20, and SMA50 intervals.</p>
                  </div>
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-1">
                    <div className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Gemini Synthesis</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Distills complex narratives and provides directional bias recommendations.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
