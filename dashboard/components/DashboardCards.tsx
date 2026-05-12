'use client'

import { ArrowUp, ArrowDown, AlertCircle, CheckCircle } from 'lucide-react'

interface DashboardCardsProps {
  decision: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  risk: 'Low' | 'Medium' | 'High'
  explanation: string
}

export default function DashboardCards({
  decision,
  confidence,
  risk,
  explanation,
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
            <p className="text-slate-400 text-xs">Confidence Level</p>
            <p className={`text-2xl font-bold ${config.color}`}>{confidence}%</p>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Confidence</span>
            <span>{confidence}%</span>
          </div>
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

      {/* Confidence & Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        {/* Risk Level Card */}
        <div className="bg-slate-700/30 border border-slate-600 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-medium text-sm">Risk Level</h3>
            <AlertCircle className={riskConfig[risk].color} size={20} />
          </div>
          <p className={`text-2xl font-bold ${riskConfig[risk].color}`}>
            {riskConfig[risk].label}
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {risk === 'Low' && 'Minimal volatility expected'}
            {risk === 'Medium' && 'Moderate price movement likely'}
            {risk === 'High' && 'High volatility possible'}
          </p>
        </div>

        {/* Metrics Card */}
        <div className="bg-slate-700/30 border border-slate-600 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 font-medium text-sm">Score</h3>
            <CheckCircle className="text-blue-400" size={20} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-slate-400 text-xs mb-1">Strength</p>
              <p className="text-lg font-bold text-blue-400">{confidence}%</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Signal</p>
              <p className="text-lg font-bold text-cyan-400">Strong</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">AI Analysis Explanation</h3>
        
        <div className="space-y-3 max-h-48 overflow-y-auto pr-4">
          {explanation.split('\n').filter(line => line.trim()).map((line, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm leading-relaxed">{line.trim()}</p>
            </div>
          ))}
        </div>

        {/* Custom Scrollbar */}
        <style>{`
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 10px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 10px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
          }
        `}</style>
      </div>
    </div>
  )
}
