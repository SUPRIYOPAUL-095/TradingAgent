'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader } from 'lucide-react'

export default function AnalyzePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    company_symbol: '',
    analysis_date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.company_symbol.trim()) {
      setError('Please enter a company symbol')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create analysis')
      }

      const data = await response.json()
      setSuccess(`Analysis queued successfully! ID: ${data.analysis_id}`)
      setFormData({
        company_symbol: '',
        analysis_date: new Date().toISOString().split('T')[0],
      })

      setTimeout(() => {
        router.push(`/analysis/${data.analysis_id}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-trading-darker">
      {/* Header */}
      <header className="border-b border-trading-border bg-trading-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold gradient-text">New Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Trigger a new trading analysis</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="trading-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Symbol Input */}
            <div>
              <label htmlFor="company_symbol" className="block text-sm font-medium text-gray-300 mb-2">
                Company Symbol *
              </label>
              <input
                type="text"
                id="company_symbol"
                name="company_symbol"
                value={formData.company_symbol}
                onChange={handleChange}
                placeholder="e.g., AAPL, RELIANCE.NS"
                className="w-full px-4 py-2 rounded-lg bg-trading-darker border border-trading-border text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">
                Enter the stock symbol or ticker (e.g., AAPL for Apple, RELIANCE.NS for Reliance)
              </p>
            </div>

            {/* Analysis Date Input */}
            <div>
              <label htmlFor="analysis_date" className="block text-sm font-medium text-gray-300 mb-2">
                Analysis Date *
              </label>
              <input
                type="date"
                id="analysis_date"
                name="analysis_date"
                value={formData.analysis_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-trading-darker border border-trading-border text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">
                Select the date for which to perform the analysis
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-success text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Queuing Analysis...
                  </>
                ) : (
                  'Queue Analysis'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 py-3 px-6 rounded-lg font-medium bg-trading-card border border-trading-border text-gray-100 hover:bg-trading-border transition-all"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 pt-8 border-t border-trading-border">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">How it Works</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                <span>Enter a stock symbol (ticker) and select an analysis date</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                <span>Our trading agents will analyze the stock using multiple indicators</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                <span>Each agent (market, sentiment, news, fundamentals) provides insights</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">4.</span>
                <span>The final trading decision (BUY/SELL/HOLD) is determined based on consensus</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">5.</span>
                <span>View results in the dashboard within the polling interval (30 seconds)</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
