'use client'

import { useState } from 'react'
import { Settings, Save, RotateCcw, Zap, Shield, Bell } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
              <Settings size={32} /> Settings
            </h1>
            <p className="text-slate-400">Configure your Gemini AI trading parameters</p>
          </div>
          {saved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 text-sm">
              ✓ Settings saved successfully
            </div>
          )}
        </div>

        {/* AI Configuration */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">AI Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Info */}
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
              <p className="text-sm font-medium text-slate-300 mb-1">Active Model</p>
              <p className="text-lg font-bold text-white">Google Gemini 1.5 Flash</p>
              <p className="text-xs text-slate-400 mt-2">Optimized for fast, accurate technical analysis</p>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Risk Tolerance
              </label>
              <div className="flex gap-2">
                {(['conservative', 'moderate', 'aggressive'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setConfig({ ...config, riskLevel: level })}
                    className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                      config.riskLevel === level
                        ? level === 'conservative'
                          ? 'bg-green-500 text-white'
                          : level === 'moderate'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Affects recommendation strength and confidence thresholds
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Preferences</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition cursor-pointer">
              <div>
                <p className="font-medium text-white">Enable Analysis Engine</p>
                <p className="text-xs text-slate-400">Allow AI to process stock data</p>
              </div>
              <input
                type="checkbox"
                checked={config.analysisEnabled}
                onChange={e => setConfig({ ...config, analysisEnabled: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-600 border-slate-500 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition cursor-pointer">
              <div>
                <p className="font-medium text-white flex items-center gap-2">
                  <Bell size={16} /> Notifications
                </p>
                <p className="text-xs text-slate-400">Get alerts when analysis is complete</p>
              </div>
              <input
                type="checkbox"
                checked={config.notificationsEnabled}
                onChange={e => setConfig({ ...config, notificationsEnabled: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-600 border-slate-500 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
