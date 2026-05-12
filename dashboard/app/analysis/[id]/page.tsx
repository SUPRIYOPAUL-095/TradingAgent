'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { TradingDecision, AgentReport } from '@/lib/types'
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react'

const AGENT_COLORS: { [key: string]: string } = {
  'market_analyst': 'bg-blue-500/10',
  'sentiment_analyst': 'bg-purple-500/10',
  'news_analyst': 'bg-cyan-500/10',
  'fundamentals_analyst': 'bg-orange-500/10',
  'research_manager': 'bg-green-500/10',
  'trader': 'bg-red-500/10',
  'risk_manager': 'bg-pink-500/10',
}

const AGENT_LABEL_COLORS: { [key: string]: string } = {
  'market_analyst': 'text-blue-400',
  'sentiment_analyst': 'text-purple-400',
  'news_analyst': 'text-cyan-400',
  'fundamentals_analyst': 'text-orange-400',
  'research_manager': 'text-green-400',
  'trader': 'text-red-400',
  'risk_manager': 'text-pink-400',
}

export default function AnalysisDetailPage() {
  const params = useParams()
  const analysisId = params.id as string

  const [decisions, setDecisions] = useState<TradingDecision[]>([])
  const [reports, setReports] = useState<AgentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analysis/${analysisId}`)
        if (!response.ok) throw new Error('Failed to fetch analysis')
        
        const data = await response.json()
        setDecisions(data.decisions || [])
        setReports(data.reports || [])
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
    const interval = setInterval(fetchAnalysis, 30000)
    return () => clearInterval(interval)
  }, [analysisId])

  if (loading) {
    return (
      <div className="min-h-screen bg-trading-darker flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <Loader size={48} className="animate-spin text-blue-500 mb-4" />
          </div>
          <p className="text-gray-400">Loading analysis details...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold gradient-text">Analysis Details</h1>
          <p className="text-gray-400 text-sm mt-1">ID: {analysisId}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-3 text-danger">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Trading Decision */}
        {decisions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Trading Decision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decisions.map((decision) => {
                const decisionColors: Record<string, string> = {
                  BUY: 'bg-success/10 border-success/30 text-success',
                  SELL: 'bg-danger/10 border-danger/30 text-danger',
                  HOLD: 'bg-warning/10 border-warning/30 text-warning',
                }

                const decisionColor =
                  decisionColors[decision.action] ||
                  'bg-gray-500/10 border-gray-500/30 text-gray-500'

                return (
                  <div key={decision.id} className={`trading-card p-6 border ${decisionColor}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Company</p>
                        <p className="text-xl font-bold">{decision.symbol}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Decision</p>
                        <p className="text-3xl font-bold">{decision.action}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Date</p>
                        <p className="text-sm">{new Date(decision.created_at || '').toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Confidence</p>
                        <p className="text-sm font-medium">
                          {((decision.confidence || 0.5) * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Agent Reports */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Agent Reports</h2>
          
          {reports.length === 0 ? (
            <div className="trading-card p-8 text-center">
              <p className="text-gray-400">No agent reports available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => {
                const agentKey = report.agent_name.toLowerCase().replace(/\s+/g, '_')
                const bgColor = AGENT_COLORS[agentKey] || 'bg-gray-500/10'
                const labelColor = AGENT_LABEL_COLORS[agentKey] || 'text-gray-400'

                return (
                  <div key={report.id} className={`trading-card p-6 border border-trading-border hover:border-trading-border/80 transition-all ${bgColor}`}>
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className={`font-bold text-lg ${labelColor}`}>
                            {report.agent_name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'} at{' '}
                            {report.created_at ? new Date(report.created_at).toLocaleTimeString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-2">Report</p>
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {report.report}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
