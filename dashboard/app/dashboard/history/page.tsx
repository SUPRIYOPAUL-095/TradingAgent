'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Target,
  DollarSign,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Percent,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

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

// Realistic backtest history for showcase
const mockTradeHistory: TradeRecord[] = [
  {
    id: '1',
    company: 'RELIANCE.NS',
    decision: 'BUY',
    entryDate: '2026-06-01',
    exitDate: '2026-06-10',
    entryPrice: 2450.0,
    exitPrice: 2680.0,
    returnPercent: 9.38,
    confidence: 85,
    status: 'won'
  },
  {
    id: '2',
    company: 'TCS.NS',
    decision: 'BUY',
    entryDate: '2026-06-05',
    exitDate: '2026-06-12',
    entryPrice: 3600.0,
    exitPrice: 3845.0,
    returnPercent: 6.81,
    confidence: 78,
    status: 'won'
  },
  {
    id: '3',
    company: 'INFY.NS',
    decision: 'SELL',
    entryDate: '2026-06-08',
    exitDate: '2026-06-11',
    entryPrice: 1550.0,
    exitPrice: 1610.0,
    returnPercent: -3.87,
    confidence: 70,
    status: 'lost'
  },
  {
    id: '4',
    company: 'HDFCBANK.NS',
    decision: 'BUY',
    entryDate: '2026-06-10',
    exitDate: '2026-06-18',
    entryPrice: 1680.0,
    exitPrice: 1756.0,
    returnPercent: 4.52,
    confidence: 82,
    status: 'won'
  },
  {
    id: '5',
    company: 'WIPRO.NS',
    decision: 'BUY',
    entryDate: '2026-06-12',
    exitDate: '2026-06-20',
    entryPrice: 480.0,
    exitPrice: 520.0,
    returnPercent: 8.33,
    confidence: 90,
    status: 'won'
  }
]

const backtestResults: BacktestResult = {
  totalTrades: 5,
  winRate: 80.0,
  profitFactor: 3.25,
  totalReturn: 25.17,
  avgWin: 7.26,
  avgLoss: 3.87,
  maxDrawdown: 3.87,
  sharpeRatio: 2.14,
}

// Equity curve data points
const equityCurveData = [
  { day: 'Start', returnVal: 0 },
  { day: 'Trade 1', returnVal: 9.38 },
  { day: 'Trade 2', returnVal: 16.19 },
  { day: 'Trade 3', returnVal: 12.32 },
  { day: 'Trade 4', returnVal: 16.84 },
  { day: 'Trade 5', returnVal: 25.17 }
]

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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Backtest Analytics & Portfolio History</h2>
        <p className="text-xs text-slate-400">Review model execution accuracy, win logs, and system metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Portfolio Return', value: `${backtestResults.totalReturn}%`, sub: 'Cumulative gain', icon: DollarSign, color: 'text-emerald-400', glow: 'glass-glow-emerald', bg: 'bg-emerald-500/5' },
          { label: 'Hit Rate (Win %)', value: `${backtestResults.winRate}%`, sub: 'Out of 5 test runs', icon: Target, color: 'text-blue-400', glow: 'glass-glow-cyan', bg: 'bg-blue-500/5' },
          { label: 'Profit Factor Ratio', value: `${backtestResults.profitFactor}`, sub: 'Gross profit / loss', icon: BarChart3, color: 'text-purple-400', glow: 'glass-glow-purple', bg: 'bg-purple-500/5' },
          { label: 'Max Drawdown (DD)', value: `${backtestResults.maxDrawdown}%`, sub: 'Peak-to-trough drop', icon: TrendingDown, color: 'text-rose-400', glow: 'glass-glow-rose', bg: 'bg-rose-500/5' }
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              whileHover={{ y: -2 }}
              key={idx}
              className={`glass-panel border-slate-900 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between h-32 ${item.glow} ${item.bg}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className={`text-2xl font-mono font-bold ${item.color} mt-1`}>{item.value}</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center">
                  <Icon className={item.color} size={14} />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">{item.sub}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Auxiliary Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Average Win Size', value: `+${backtestResults.avgWin}%`, color: 'text-emerald-400' },
          { label: 'Average Loss Size', value: `-${backtestResults.avgLoss}%`, color: 'text-rose-400' },
          { label: 'Sharpe Ratio Score', value: `${backtestResults.sharpeRatio}`, color: 'text-amber-400' }
        ].map((item, idx) => (
          <div key={idx} className="glass-panel border-slate-900/60 rounded-xl p-4 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">{item.label}</span>
            <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Cumulative equity chart */}
      <div className="glass-panel border-slate-900/60 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Award size={16} className="text-blue-400" />
            <span>Equity Growth Curve</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Incremental portfolio gains across historical signals</p>
        </div>

        <div className="h-64 w-full pr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurveData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
              <XAxis dataKey="day" stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <YAxis stroke="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }} tickFormatter={(v) => `+${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#030712',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Area
                type="monotone"
                dataKey="returnVal"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#equityGradient)"
                name="Return"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trades History Table */}
      <div className="glass-panel border-slate-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Navigation & Sorters */}
        <div className="p-4 border-b border-slate-900 flex flex-wrap justify-between items-center gap-3 bg-slate-950/40">
          <div className="flex gap-1.5">
            {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map(decision => (
              <button
                key={decision}
                onClick={() => setFilterDecision(decision)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all
                  ${filterDecision === decision
                    ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                    : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
              >
                {decision}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-950 text-xs font-semibold text-slate-300 rounded-lg border border-slate-900 focus:outline-none focus:border-blue-500"
            >
              <option value="date">Date</option>
              <option value="return">Return %</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-950/30 border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6 text-left">Company</th>
                <th className="py-3 px-6 text-left">Signal</th>
                <th className="py-3 px-6 text-left">Exit Date</th>
                <th className="py-3 px-6 text-right">Entry Price</th>
                <th className="py-3 px-6 text-right">Exit Price</th>
                <th className="py-3 px-6 text-right">Yield</th>
                <th className="py-3 px-6 text-left">Confidence</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="font-medium text-slate-300">
              {sortedTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500 font-semibold">
                    No matching historical trades found.
                  </td>
                </tr>
              ) : (
                sortedTrades.map((trade) => {
                  const isTradeWin = trade.returnPercent >= 0
                  return (
                    <tr key={trade.id} className="border-b border-slate-900 hover:bg-slate-900/30 transition-all duration-200">
                      <td className="py-3 px-6 font-mono font-bold text-white">{trade.company}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] border
                            ${trade.decision === 'BUY'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : trade.decision === 'SELL'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                        >
                          {trade.decision}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-slate-400 font-mono">
                        {new Date(trade.exitDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-semibold text-white">₹{trade.entryPrice}</td>
                      <td className="py-3 px-6 text-right font-mono font-semibold text-white">₹{trade.exitPrice}</td>
                      <td className={`py-3 px-6 text-right font-mono font-bold ${isTradeWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isTradeWin ? '+' : ''}{trade.returnPercent}%
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${trade.confidence}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold">{trade.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase border
                            ${trade.status === 'won'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : trade.status === 'lost'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}
                        >
                          {trade.status === 'won' ? '✓ Profit' : trade.status === 'lost' ? '✗ Loss' : 'Open'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
