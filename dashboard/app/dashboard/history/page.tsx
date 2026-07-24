'use client'

import { useState } from 'react'
import { History, TrendingUp, TrendingDown, Filter, Download, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, Target, DollarSign, Percent, Award, ArrowUp, ArrowDown } from 'lucide-react'
import { formatNumber, formatPercentage, formatCurrency } from '@/lib/utils'

interface TradeRecord {
  id: string
  company: string
  decision: 'BUY' | 'SELL' | 'HOLD'
  entryDate: string
  exitDate: string
  entryPrice: number
  exitPrice: number
  returnPercent: number
  confidence: number
  status: 'won' | 'lost' | 'open'
}

interface BacktestResult {
  totalTrades: number
  winRate: number
  profitFactor: number
  totalReturn: number
  avgWin: number
  avgLoss: number
  maxDrawdown: number
  sharpeRatio: number
}

const mockTradeHistory: TradeRecord[] = []

const backtestResults: BacktestResult = {
  totalTrades: 0,
  winRate: 0,
  profitFactor: 0,
  totalReturn: 0,
  avgWin: 0,
  avgLoss: 0,
  maxDrawdown: 0,
  sharpeRatio: 0,
}

export default function HistoryPage() {
  const [filterDecision, setFilterDecision] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL')
  const [sortBy, setSortBy] = useState<'date' | 'return' | 'confidence'>('date')

  const filteredTrades =
    filterDecision === 'ALL' ? mockTradeHistory : mockTradeHistory.filter(t => t.decision === filterDecision)

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
    if (sortBy === 'return') return b.returnPercent - a.returnPercent
    if (sortBy === 'confidence') return b.confidence - a.confidence
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Trading History & Backtest Results</h1>
          <p className="text-slate-400">Comprehensive performance analytics and trade records</p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl p-6 border border-green-500/20">
              <p className="text-slate-400 text-sm mb-2">Total Return</p>
              <p className="text-3xl font-bold text-green-400">{formatPercentage(backtestResults.totalReturn)}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">On invested capital</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Win Rate</p>
              <Target className="text-blue-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-400">{formatPercentage(backtestResults.winRate)}</p>
            <p className="text-xs text-slate-500 mt-2">{backtestResults.totalTrades} trades analyzed</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 rounded-xl p-6 border border-purple-500/20">
              <p className="text-slate-400 text-sm mb-2">Profit Factor</p>
              <p className="text-3xl font-bold text-purple-400">{formatNumber(backtestResults.profitFactor)}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Gross profit / Gross loss</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Max Drawdown</p>
              <TrendingDown className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-red-400">{formatPercentage(backtestResults.maxDrawdown)}</p>
            <p className="text-xs text-slate-500 mt-2">Largest peak-to-trough</p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Avg Win</p>
              <TrendingUp className="text-green-400" size={18} />
            </div>
            <p className="text-2xl font-bold text-green-400">{formatPercentage(backtestResults.avgWin)}</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Avg Loss</p>
              <TrendingDown className="text-red-400" size={18} />
            </div>
            <p className="text-2xl font-bold text-red-400">{formatPercentage(backtestResults.avgLoss)}</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-medium">Sharpe Ratio</p>
              <Award className="text-yellow-400" size={18} />
            </div>
            <p className="text-2xl font-bold text-yellow-400">{formatNumber(backtestResults.sharpeRatio)}</p>
          </div>
        </div>

        {/* Trade Records */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
          {/* Controls */}
          <div className="p-6 border-b border-slate-700 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map(decision => (
                <button
                  key={decision}
                  onClick={() => setFilterDecision(decision)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterDecision === decision
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {decision}
                </button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 hover:border-slate-500 transition"
              >
                <option value="date">Sort: Date</option>
                <option value="return">Sort: Return %</option>
                <option value="confidence">Sort: Confidence</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Decision</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Entry Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Entry Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Exit Price</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Return</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Confidence</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedTrades.map((trade, idx) => (
                  <tr key={trade.id} className="border-b border-slate-700 hover:bg-slate-700/20 transition">
                    <td className="px-6 py-4 text-white font-medium">{trade.company}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          trade.decision === 'BUY'
                            ? 'bg-green-500/10 text-green-400'
                            : trade.decision === 'SELL'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {trade.decision === 'BUY' && <ArrowUp size={14} />}
                        {trade.decision === 'SELL' && <ArrowDown size={14} />}
                        {trade.decision}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(trade.entryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-white">{formatCurrency(trade.entryPrice)}</td>
                    <td className="px-6 py-4 text-right text-white">{formatCurrency(trade.exitPrice)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${trade.returnPercent > 0 ? 'text-green-400' : trade.returnPercent < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                        {formatPercentage(trade.returnPercent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${trade.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{trade.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'won'
                            ? 'bg-green-500/10 text-green-400'
                            : trade.status === 'lost'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {trade.status === 'won' ? '✓ Won' : trade.status === 'lost' ? '✗ Lost' : 'Open'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Chart Info */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Cumulative Performance</h3>
          <div className="h-64 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center">
            <p className="text-slate-400">Performance chart visualization</p>
          </div>
        </div>
      </div>
    </div>
  )
}
