'use client'

import { useState } from 'react'
import { Search, Calendar, Zap, Info } from 'lucide-react'

type AnalystKey = 'market' | 'news' | 'fundamentals' | 'social'

interface AnalysisFormProps {
  onSubmit: (company: string, date: string) => Promise<void>
  loading: boolean
}

export default function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [company, setCompany] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [selectedAnalysts, setSelectedAnalysts] = useState({
    market: true,
    news: true,
    fundamentals: true,
    social: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company.trim()) {
      setError('Please enter a company symbol')
      return
    }

    // Check if at least one analyst is selected
    if (!Object.values(selectedAnalysts).some(v => v)) {
      setError('Please select at least one analyst')
      return
    }

    setError('')
    try {
      // Proceed with analysis
      await onSubmit(company.toUpperCase(), date)
      setCompany('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const toggleAnalyst = (analyst: AnalystKey) => {
    setSelectedAnalysts(prev => ({
      ...prev,
      [analyst]: !prev[analyst],
    }))
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Zap size={24} className="text-yellow-400" /> AI Market Analysis
        </h2>
        <p className="text-slate-400 text-sm">Multi-agent analysis combining technical, fundamental, and sentiment data</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Inputs */}
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
                placeholder="e.g., RELIANCE, TCS"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Enter NSE symbol (with .NS suffix)</p>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Analysis Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Historical or current date</p>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 active:scale-95"
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

        {/* Analyst Selection */}
        <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Info size={16} className="text-blue-400" />
            Select Analyst Teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'market' as AnalystKey, label: '📊 Market', desc: 'Technical' },
              { key: 'news' as AnalystKey, label: '📰 News', desc: 'Sentiment' },
              { key: 'fundamentals' as AnalystKey, label: '💰 Fundamentals', desc: 'Financial' },
              { key: 'social' as AnalystKey, label: '📱 Social', desc: 'Trends' },
            ].map(analyst => (
              <button
                key={analyst.key}
                type="button"
                onClick={() => toggleAnalyst(analyst.key)}
                className={`p-3 rounded-lg transition border ${
                  selectedAnalysts[analyst.key]
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-700/20 border-slate-600/50 text-slate-400 hover:bg-slate-700/30'
                }`}
              >
                <div className="text-sm font-medium">{analyst.label}</div>
                <div className="text-xs text-opacity-70">{analyst.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
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
