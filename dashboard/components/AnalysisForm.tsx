'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Zap, Calendar, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnalysisFormProps {
  onSubmit: (company: string, date: string) => Promise<void>
  loading: boolean
}

const STOCK_CHIPS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance' },
  { symbol: 'TCS.NS', name: 'TCS' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
]

const ALL_SYMBOLS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'LICI.NS', name: 'Life Insurance Corporation of India' },
  { symbol: 'ITC.NS', name: 'ITC Ltd.' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.' },
]

export default function AnalysisForm({ onSubmit, loading }: AnalysisFormProps) {
  const [company, setCompany] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split('T')[0]

  // Filtered suggestions
  const filteredSuggestions = company.trim() 
    ? ALL_SYMBOLS.filter(s => 
        s.symbol.toLowerCase().includes(company.toLowerCase()) || 
        s.name.toLowerCase().includes(company.toLowerCase())
      )
    : []

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (val: string) => {
    // Upper case and space removal
    const formatted = val.toUpperCase().replace(/\s+/g, '')
    setCompany(formatted)
    setError('')
    setShowSuggestions(true)
  }

  const selectSuggestion = (symbol: string) => {
    setCompany(symbol)
    setShowSuggestions(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!company.trim()) {
      setError('Please enter a company symbol')
      return
    }

    setError('')
    try {
      await onSubmit(company.trim().toUpperCase(), date)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission')
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-900/60 shadow-xl relative overflow-hidden">
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Zap size={18} />
            </span>
            <span>AI Analytical Agent Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Initiate real-time technical computation combined with Google Gemini market synthesis
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {/* Stock Symbol Selection */}
          <div className="md:col-span-6 relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Ticker Symbol
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
              <input
                type="text"
                value={company}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g. RELIANCE.NS"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto"
                >
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.symbol}
                      type="button"
                      onClick={() => selectSuggestion(item.symbol)}
                      className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center justify-between border-b border-slate-800/40 last:border-0"
                    >
                      <span className="font-mono font-semibold">{item.symbol}</span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{item.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[10px] text-slate-500 font-medium mr-1">Quick Select:</span>
              {STOCK_CHIPS.map((chip) => (
                <button
                  key={chip.symbol}
                  type="button"
                  onClick={() => selectSuggestion(chip.symbol)}
                  className="px-2 py-1 text-[10px] font-semibold bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-900 rounded-md transition-all"
                >
                  {chip.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selector */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar size={13} />
              <span>Backtest Date</span>
            </label>
            <input
              type="date"
              value={date}
              max={today}
              onChange={e => setDate(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 text-sm text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          {/* Action Trigger Button */}
          <div className="md:col-span-3">
            <motion.button
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/10 border border-blue-500/15"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Zap size={15} className="fill-current text-white animate-pulse" />
                  <span>Execute Analysis</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-2.5"
          >
            <span className="text-rose-500 text-sm font-bold mt-0.5">⚠</span>
            <p className="text-rose-400 text-xs leading-normal">{error}</p>
          </motion.div>
        )}
      </form>
    </div>
  )
}
