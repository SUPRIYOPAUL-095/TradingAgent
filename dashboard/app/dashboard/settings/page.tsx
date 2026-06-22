'use client'

import { useState } from 'react'
import { Settings, Save, RotateCcw, Zap, Shield, Bell, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface Config {
  analysisEnabled: boolean
  notificationsEnabled: boolean
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>({
    analysisEnabled: true,
    notificationsEnabled: true,
    riskLevel: 'moderate',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    localStorage.setItem('tradingConfig', JSON.stringify(config))
  }

  const handleReset = () => {
    setConfig({
      analysisEnabled: true,
      notificationsEnabled: true,
      riskLevel: 'moderate',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Settings size={24} />
            <span>Terminal Configurations</span>
          </h2>
          <p className="text-xs text-slate-400">Manage Gemini AI API parameters and backtest thresholds</p>
        </div>

        {saved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-lg"
          >
            <Check size={14} />
            <span>Settings saved successfully</span>
          </motion.div>
        )}
      </div>

      {/* 1. AI Configuration */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-900/60 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Zap size={16} />
          </div>
          <h3 className="text-md font-bold text-white">AI Engine Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Active Model */}
          <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Synthesis Engine</p>
              <h4 className="text-md font-bold text-white mt-1">Google Gemini 1.5 Flash</h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
              Optimized for real-time computational parsing, index evaluations, and automated summaries.
            </p>
          </div>

          {/* Risk Level */}
          <div className="space-y-3">
            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Risk Tolerance Threshold
            </label>
            <div className="flex gap-2">
              {(['conservative', 'moderate', 'aggressive'] as const).map(level => {
                const isActive = config.riskLevel === level
                return (
                  <button
                    key={level}
                    onClick={() => setConfig({ ...config, riskLevel: level })}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex-1
                      ${isActive
                        ? level === 'conservative'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5'
                          : level === 'moderate'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/5'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Modulates recommendation strength scores, indicator crossovers, and targets limits.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Preferences */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-900/60 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Shield size={16} />
          </div>
          <h3 className="text-md font-bold text-white">Engine Preferences</h3>
        </div>

        <div className="space-y-4 pt-2">
          {/* Analysis Switch */}
          <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition cursor-pointer">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">Enable Real-Time Computation</p>
              <p className="text-[10px] text-slate-400">Trigger computations on RSI, SMA20, and SMA50 intervals on fetch.</p>
            </div>
            <input
              type="checkbox"
              checked={config.analysisEnabled}
              onChange={e => setConfig({ ...config, analysisEnabled: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-950 focus:ring-offset-2"
            />
          </label>

          {/* Notifications Switch */}
          <label className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition cursor-pointer">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bell size={13} className="text-slate-400" />
                <span>Diagnostic Notifications</span>
              </p>
              <p className="text-[10px] text-slate-400">Alert client interface when AI backtest logs compile successfully.</p>
            </div>
            <input
              type="checkbox"
              checked={config.notificationsEnabled}
              onChange={e => setConfig({ ...config, notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-950 border-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-950 focus:ring-offset-2"
            />
          </label>
        </div>
      </div>

      {/* Save / Reset triggers */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleReset}
          className="px-5 py-3 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg border border-blue-500/10"
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}
