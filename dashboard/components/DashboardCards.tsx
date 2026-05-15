'use client'

import { ArrowUp, ArrowDown, AlertCircle, CheckCircle } from 'lucide-react'

interface DashboardCardsProps {
  decision: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  risk: 'Low' | 'Medium' | 'High'
  explanation: string
  rsi: number
  sma20: number
  sma50: number
}

export default function DashboardCards({
  decision,
  confidence,
  risk,
  explanation,
  rsi,
  sma20,
  sma50,
}: DashboardCardsProps) {
  const decisionConfig = {
    BUY: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: ArrowUp },
    SELL: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: ArrowDown },
    HOLD: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: AlertCircle },
  }

  const riskConfig = {
    Low: { color: 'text-green-400', label: 'Low Risk' },
    Medium: { color: 'text-yellow-400', label: 'Medium Risk' },
    High: { color: 'text-red-400', label: 'High Risk' },
  }

  const config = decisionConfig[decision]
  const DecisionIcon = config.icon

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Decision Card */}
      <div className={`${config.bg} border ${config.border} rounded-2xl p-8 backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-300 font-medium">AI Decision</h3>
          <DecisionIcon className={config.color} size={24} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-4xl font-bold ${config.color} mb-2`}>{decision}</p>
            <p className="text-slate-400 text-sm">Recommendation</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">Confidence</p>
            <p className={`text-2xl font-bold ${config.color}`}>{confidence}%</p>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                decision === 'BUY'
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : decision === 'SELL'
                  ? 'bg-gradient-to-r from-red-500 to-red-400'
                  : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Technical Indicators Card */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
        <h3 className="text-slate-300 font-medium text-sm mb-4 flex items-center gap-2">
          <CheckCircle className="text-blue-400" size={18} /> Technical Indicators
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">RSI</p>
            <p className="text-xl font-bold text-blue-400">{rsi}</p>
          </div>
          <div className="text-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">SMA20</p>
            <p className="text-xl font-bold text-cyan-400">{sma20}</p>
          </div>
          <div className="text-center p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">SMA50</p>
            <p className="text-xl font-bold text-indigo-400">{sma50}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Trend Strength</span>
            <span className="text-xs font-semibold text-blue-400">Positive</span>
          </div>
        </div>
      </div>

      {/* Risk Level Card */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-300 font-medium text-sm">Risk Assessment</h3>
          <AlertCircle className={riskConfig[risk].color} size={20} />
        </div>
        <p className={`text-3xl font-bold ${riskConfig[risk].color} mb-2`}>
          {riskConfig[risk].label}
        </p>
        <p className="text-slate-400 text-xs leading-relaxed">
          {risk === 'Low' && 'Technical indicators suggest stable price action with low volatility.'}
          {risk === 'Medium' && 'Moderate volatility expected based on current indicator crossovers.'}
          {risk === 'High' && 'High volatility signals detected. Exercise caution with position sizing.'}
        </p>
      </div>

      {/* Explanation Panel */}
      <div className="lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">Gemini AI Analysis Summary</h3>
        
        <div className="space-y-4">
          {explanation.split('\n').filter(line => line.trim()).map((line, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm leading-relaxed">{line.trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
