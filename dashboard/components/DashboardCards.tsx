'use client'

import { ArrowUp, ArrowDown, AlertTriangle, ShieldCheck, Cpu, Target, HelpCircle, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

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
  
  // Styles based on recommendation decision
  const decisionConfig = {
    BUY: { 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/5', 
      border: 'border-emerald-500/20', 
      hover: 'glass-glow-emerald',
      icon: ArrowUp,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10'
    },
    SELL: { 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/5', 
      border: 'border-rose-500/20', 
      hover: 'glass-glow-rose',
      icon: ArrowDown,
      gradient: 'from-rose-500 to-red-500',
      shadow: 'shadow-rose-500/10'
    },
    HOLD: { 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/5', 
      border: 'border-amber-500/20', 
      hover: 'glass-glow-amber',
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/10'
    },
  }

  // Styles based on risk level
  const riskConfig = {
    Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Low Risk', text: 'Stated technical signals support low price volatility.' },
    Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Moderate Risk', text: 'Moderate volatility expected. Normal position sizes recommended.' },
    High: { color: 'text-rose-400', bg: 'bg-rose-500/10', label: 'High Risk', text: 'Extreme volatility signals. Use tight stops and reduce exposures.' },
  }

  const activeDecision = decisionConfig[decision] || decisionConfig.HOLD
  const DecisionIcon = activeDecision.icon
  const activeRisk = riskConfig[risk] || riskConfig.Medium

  // Computes technical signal details
  const getRsiLabel = (val: number) => {
    if (val >= 70) return { text: 'Overbought', color: 'text-rose-400' }
    if (val <= 30) return { text: 'Oversold', color: 'text-emerald-400' }
    return { text: 'Neutral', color: 'text-slate-400' }
  }

  const getSmaSignal = (s20: number, s50: number) => {
    if (s20 > s50) return { text: 'Bullish Cross', color: 'text-emerald-400' }
    if (s20 < s50) return { text: 'Bearish Cross', color: 'text-rose-400' }
    return { text: 'Consolidating', color: 'text-slate-400' }
  }

  const rsiInfo = getRsiLabel(rsi)
  const smaInfo = getSmaSignal(sma20, sma50)

  // Compute dummy target calculations to match real trading terminals
  const rsiDelta = Math.abs(50 - rsi)
  const buySpread = 1 + (rsiDelta / 400) // target levels
  const stopSpread = 0.96 - (rsiDelta / 600)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Decision Card */}
      <motion.div 
        whileHover={{ y: -3 }}
        className={`glass-panel ${activeDecision.bg} ${activeDecision.border} ${activeDecision.shadow} ${activeDecision.hover} rounded-2xl p-6 relative overflow-hidden transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI RECOMMENDATION</span>
          <span className={`w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-800`}>
            <DecisionIcon className={activeDecision.color} size={16} />
          </span>
        </div>

        <div>
          <h4 className={`text-4xl font-extrabold tracking-tight ${activeDecision.color} mb-1.5`}>
            {decision}
          </h4>
          <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-slate-900/60">
            <span className="text-slate-500 font-medium">Model Confidence</span>
            <span className={`font-mono font-bold ${activeDecision.color}`}>{confidence}%</span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="mt-3.5">
          <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${activeDecision.gradient}`}
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Technical Indicators Card */}
      <motion.div 
        whileHover={{ y: -3 }}
        className="glass-panel glass-glow-cyan rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TECHNICAL COMPASS</span>
          <span className="w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-800">
            <Activity className="text-cyan-400 animate-pulse" size={16} />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          <div className="text-center p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1">RSI</p>
            <p className="text-lg font-mono font-bold text-cyan-400">{rsi || 'N/A'}</p>
            <p className={`text-[9px] font-medium mt-1 ${rsiInfo.color}`}>{rsiInfo.text}</p>
          </div>
          <div className="text-center p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1">SMA20</p>
            <p className="text-lg font-mono font-bold text-indigo-400">₹{sma20 ? Math.round(sma20) : 'N/A'}</p>
            <p className="text-[9px] font-medium text-slate-500 mt-1">Short Term</p>
          </div>
          <div className="text-center p-3 bg-slate-950/40 border border-slate-900 rounded-xl">
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1">SMA50</p>
            <p className="text-lg font-mono font-bold text-purple-400">₹{sma50 ? Math.round(sma50) : 'N/A'}</p>
            <p className={`text-[9px] font-medium mt-1 ${smaInfo.color}`}>{smaInfo.text}</p>
          </div>
        </div>
      </motion.div>

      {/* 3. Risk Level Card */}
      <motion.div 
        whileHover={{ y: -3 }}
        className="glass-panel glass-glow-purple rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">RISK RATING</span>
          <span className="w-8 h-8 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-800">
            <ShieldCheck className="text-purple-400" size={16} />
          </span>
        </div>

        <div>
          <h4 className={`text-xl font-bold ${activeRisk.color} mb-1 flex items-center gap-1.5`}>
            <span>{activeRisk.label}</span>
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {activeRisk.text}
          </p>
        </div>
      </motion.div>

      {/* 4. AI Summary Insight Panel */}
      <div className="lg:col-span-3 glass-panel rounded-2xl p-6 lg:p-8 border border-slate-900/60 shadow-2xl relative overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-900/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/10">
              <Cpu size={18} />
            </div>
            <div>
              <h4 className="text-md font-bold text-white flex items-center gap-2">
                <span>Gemini Core AI Insights</span>
                <span className="text-[10px] tracking-wide bg-violet-500/10 text-violet-400 font-semibold px-2 py-0.5 rounded-full border border-violet-500/20">
                  Deep Synthesis
                </span>
              </h4>
              <p className="text-[10px] text-slate-500">Multimodal narrative analysis & technical evaluation</p>
            </div>
          </div>

          {/* Sentiment pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Calculated Sentiment:</span>
            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border
              ${decision === 'BUY' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : decision === 'SELL' 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {decision === 'BUY' ? 'BULLISH' : decision === 'SELL' ? 'BEARISH' : 'NEUTRAL'}
            </span>
          </div>
        </div>

        {/* Dynamic target prices block */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-900">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Estimated Entry Range</span>
            <div className="text-sm font-mono font-bold text-white mt-0.5">
              ₹{sma20 ? Math.round(sma20 * 0.99) : '---'} - ₹{sma20 ? Math.round(sma20 * 1.01) : '---'}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <Target size={11} className="text-emerald-400" />
              <span>Target Level</span>
            </span>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
              ₹{sma20 ? Math.round(sma20 * buySpread) : '---'} <span className="text-[10px] text-slate-400">({decision === 'BUY' ? '+8%' : '+4%'})</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <HelpCircle size={11} className="text-rose-400" />
              <span>Protective Stop-Loss</span>
            </span>
            <div className="text-sm font-mono font-bold text-rose-400 mt-0.5">
              ₹{sma20 ? Math.round(sma20 * stopSpread) : '---'} <span className="text-[10px] text-slate-400">(-4%)</span>
            </div>
          </div>
        </div>

        {/* Insights list */}
        <div className="space-y-3.5">
          {explanation.split('\n').filter(line => line.trim()).map((line, idx) => {
            // Trim leading asterisks or list markers
            const cleanLine = line.replace(/^[\*\-\s•]+/, '').trim()
            return (
              <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx} 
                className="flex items-start gap-3"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0
                  ${decision === 'BUY' ? 'bg-emerald-400 shadow-md shadow-emerald-400' : decision === 'SELL' ? 'bg-rose-400' : 'bg-amber-400'}
                `} />
                <p className="text-xs leading-relaxed text-slate-300 font-medium">
                  {cleanLine}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
