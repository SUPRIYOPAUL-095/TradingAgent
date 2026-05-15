'use client'

import { useState } from 'react'
import { Search, Zap } from 'lucide-react'

interface AnalysisFormProps {
  onSubmit: (company: string, date: string) => Promise<void>
  loading: boolean
}

export default function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [company, setCompany] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company.trim()) {
      setError('Please enter a company symbol')
      return
    }

    setError('')
    try {
      await onSubmit(company.toUpperCase(), date)
      setCompany('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap size={24} className="text-blue-400" /> Stock Analysis
        </h2>
        <p className="text-slate-400 text-sm">Real-time technical indicators and AI-powered recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Company Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Stock Symbol</label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value.toUpperCase())}
                placeholder="e.g. INFY.NS"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">NSE symbols preferred (e.g. RELIANCE.NS)</p>
          </div>

          {/* Date Input */}
          <div className="hidden">
            {/* Kept hidden for now to maintain layout but remove from UI if not needed */}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* Submit Button */}
          <div className="flex items-end md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <div className="text-red-400 mt-0.5">⚠</div>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>
    </div>
  )
}
