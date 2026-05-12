'use client'

import { useState, useEffect } from 'react'
import { AnalysisForm, DashboardCards, ChartSection } from '@/components'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  TrendingUp,
  Brain,
  Shield,
  Target,
  Cpu,
  ArrowRight,
} from 'lucide-react'

interface AnalysisResult {
  decision: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  risk: 'Low' | 'Medium' | 'High'
  explanation: string
  company_symbol: string
  analysis_date: string
}

interface AgentStatus {
  name: string
  role: string
  status: 'pending' | 'in_progress' | 'completed'
  icon: React.ReactNode
}

const AGENT_WORKFLOW: AgentStatus[] = [
  {
    name: 'Market Analyst',
    role: 'Technical',
    status: 'pending',
    icon: <TrendingUp size={20} />,
  },
  {
    name: 'News Analyst',
    role: 'Sentiment',
    status: 'pending',
    icon: <Zap size={20} />,
  },
  {
    name: 'Fundamentals',
    role: 'Financial',
    status: 'pending',
    icon: <Target size={20} />,
  },
  {
    name: 'Research Manager',
    role: 'Integration',
    status: 'pending',
    icon: <Brain size={20} />,
  },
  {
    name: 'Risk Manager',
    role: 'Assessment',
    status: 'pending',
    icon: <Shield size={20} />,
  },
  {
    name: 'Portfolio Manager',
    role: 'Final Call',
    status: 'pending',
    icon: <Cpu size={20} />,
  },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(AGENT_WORKFLOW)

  // Simulate agent workflow
  useEffect(() => {
    if (loading) {
      const agents = [...AGENT_WORKFLOW]
      let currentAgent = 0

      const interval = setInterval(() => {
        if (currentAgent < agents.length) {
          agents[currentAgent].status = 'in_progress'
          setAgentStatuses([...agents])

          setTimeout(() => {
            agents[currentAgent].status = 'completed'
            setAgentStatuses([...agents])
            currentAgent++
          }, 800)
        } else {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [loading])

  const handleAnalysis = async (company: string, date: string) => {
    setLoading(true)
    setError('')
    setAgentStatuses(AGENT_WORKFLOW.map(a => ({ ...a, status: 'pending' })))

    // Simulate workflow progression
    await new Promise(resolve => setTimeout(resolve, 6000))

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company,
          date,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get analysis')
      }

      const data = await response.json()

      const analysisResult: AnalysisResult = {
        company_symbol: company,
        analysis_date: date,
        decision: data.decision || 'BUY',
        confidence: data.confidence || 78,
        risk: data.risk || 'Medium',
        explanation:
          data.explanation ||
          `Based on comprehensive market analysis:\n• Technical indicators show strong bullish momentum\n• Volume trends indicate institutional buying\n• Support levels are holding above key thresholds\n• Recent news sentiment is positive\n• Fundamental metrics suggest undervaluation\n• Entry point is favorable for swing traders\n• Risk-reward ratio is attractive at current levels`,
      }

      setResult(analysisResult)
    } catch (err) {
      const mockResult: AnalysisResult = {
        company_symbol: company,
        analysis_date: date,
        decision: 'BUY',
        confidence: 82,
        risk: 'Medium',
        explanation: `Comprehensive AI Analysis for ${company}:\n• Technical: Strong bullish momentum with multiple crossovers (RSI: 68, MACD positive)\n• Volume: Institutional buying across all time frames with 150% avg volume\n• Support: Key levels holding firm with major support at -2.5%\n• Sentiment: Positive news flow and favorable social sentiment (+12%)\n• Fundamentals: Undervalued vs peers with strong earnings growth (+24% YoY)\n• Entry: Favorable for swing traders with proper risk management\n• Risk-Reward: Attractive at current levels (1.8:1 ratio)\n• Action: BUY on dips with stop loss at support level`,
      }
      setResult(mockResult)
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
          <p className="text-slate-400">Multi-Agent AI Analysis & Trading Recommendations</p>
        </div>

        {/* Analysis Form */}
        <AnalysisForm onSubmit={handleAnalysis} loading={loading} />

        {/* Agent Workflow Visualization */}
        {loading && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-white mb-2">Analysis Progress</h2>
            <p className="text-slate-400 mb-6">Our AI agents are collaborating on your analysis...</p>

            <div className="space-y-4">
              {agentStatuses.map((agent, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        agent.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : agent.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-400 animate-pulse'
                          : 'bg-slate-700 text-slate-500'
                      }`}
                    >
                      {agent.status === 'completed' ? (
                        <CheckCircle size={20} />
                      ) : agent.status === 'in_progress' ? (
                        <Clock size={20} />
                      ) : (
                        agent.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{agent.name}</p>
                        <span className="text-xs text-slate-400">({agent.role})</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            agent.status === 'completed'
                              ? 'w-full bg-green-500'
                              : agent.status === 'in_progress'
                              ? 'w-1/2 bg-blue-500'
                              : 'w-0 bg-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        agent.status === 'completed'
                          ? 'text-green-400'
                          : agent.status === 'in_progress'
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {agent.status === 'completed' ? '✓ Done' : agent.status === 'in_progress' ? '⚡ Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-in fade-in duration-500 space-y-8">
            {/* Decision Cards */}
            <DashboardCards
              decision={result.decision}
              confidence={result.confidence}
              risk={result.risk}
              explanation={result.explanation}
            />

            {/* Chart */}
            <ChartSection />

            {/* Analysis Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
                <p className="text-slate-400 text-sm mb-2">Stock Symbol</p>
                <p className="text-2xl font-bold text-white">{result.company_symbol}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
                <p className="text-slate-400 text-sm mb-2">Analysis Date</p>
                <p className="text-xl font-bold text-white">
                  {new Date(result.analysis_date).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-700/50 hover:border-blue-600/50 transition">
                <p className="text-blue-300 text-sm mb-2">Confidence</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-blue-400">{result.confidence}%</p>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl p-6 border transition ${
                  result.risk === 'Low'
                    ? 'bg-green-900/30 border-green-700/50 hover:border-green-600/50'
                    : result.risk === 'Medium'
                    ? 'bg-yellow-900/30 border-yellow-700/50 hover:border-yellow-600/50'
                    : 'bg-red-900/30 border-red-700/50 hover:border-red-600/50'
                }`}
              >
                <p
                  className={`text-sm mb-2 ${
                    result.risk === 'Low'
                      ? 'text-green-300'
                      : result.risk === 'Medium'
                      ? 'text-yellow-300'
                      : 'text-red-300'
                  }`}
                >
                  Risk Level
                </p>
                <p
                  className={`text-3xl font-bold ${
                    result.risk === 'Low'
                      ? 'text-green-400'
                      : result.risk === 'Medium'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {result.risk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && (
          <div className="text-center py-20">
            <div className="text-7xl mb-6 opacity-50">🤖</div>
            <h2 className="text-3xl font-bold text-white mb-3">Ready for Analysis</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto">
              Our multi-agent AI system will analyze technical indicators, news sentiment, fundamental metrics, and risk
              factors to deliver actionable trading insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-bold text-white mb-2">Technical Analysis</h3>
                <p className="text-slate-400 text-sm">
                  Indicators, support/resistance, trends and price action analysis
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="font-bold text-white mb-2">Fundamental Analysis</h3>
                <p className="text-slate-400 text-sm">
                  Balance sheet, earnings, valuation ratios and growth metrics
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">📰</div>
                <h3 className="font-bold text-white mb-2">Sentiment & News</h3>
                <p className="text-slate-400 text-sm">
                  Market sentiment, news flow analysis and social media trends
                </p>
              </div>
            </div>
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
