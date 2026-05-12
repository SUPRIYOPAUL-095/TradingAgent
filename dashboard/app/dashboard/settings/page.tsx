'use client'

import { useState } from 'react'
import { Settings, Save, RotateCcw, Zap, Database, Shield, Bell } from 'lucide-react'

interface Config {
  deepThinkModel: string
  quickThinkModel: string
  maxDebateRounds: number
  analysisEnabled: boolean
  notificationsEnabled: boolean
  selectedAnalysts: {
    market: boolean
    news: boolean
    fundamentals: boolean
    social: boolean
  }
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  dataCache: 'enabled' | 'disabled'
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>({
    deepThinkModel: 'gpt-4',
    quickThinkModel: 'gpt-3.5-turbo',
    maxDebateRounds: 2,
    analysisEnabled: true,
    notificationsEnabled: true,
    selectedAnalysts: {
      market: true,
      news: true,
      fundamentals: true,
      social: true,
    },
    riskLevel: 'moderate',
    dataCache: 'enabled',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    localStorage.setItem('tradingConfig', JSON.stringify(config))
  }

  const handleReset = () => {
    setConfig({
      deepThinkModel: 'gpt-4',
      quickThinkModel: 'gpt-3.5-turbo',
      maxDebateRounds: 2,
      analysisEnabled: true,
      notificationsEnabled: true,
      selectedAnalysts: {
        market: true,
        news: true,
        fundamentals: true,
        social: true,
      },
      riskLevel: 'moderate',
      dataCache: 'enabled',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
              <Settings size={32} /> Trading Settings
            </h1>
            <p className="text-slate-400">Configure your AI trading analysis parameters</p>
          </div>
          {saved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 text-sm">
              ✓ Settings saved successfully
            </div>
          )}
        </div>

        {/* LLM Configuration */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white">AI Model Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deep Think LLM */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Deep Thinking Model
              </label>
              <select
                value={config.deepThinkModel}
                onChange={e => setConfig({ ...config, deepThinkModel: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="gpt-4">GPT-4 (Most Powerful)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">For complex financial analysis and strategy planning</p>
            </div>

            {/* Quick Think LLM */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Quick Thinking Model
              </label>
              <select
                value={config.quickThinkModel}
                onChange={e => setConfig({ ...config, quickThinkModel: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">For signal extraction and quick decisions</p>
            </div>

            {/* Debate Rounds */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Max Debate Rounds
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={config.maxDebateRounds}
                  onChange={e => setConfig({ ...config, maxDebateRounds: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-blue-400 w-12 text-center">
                  {config.maxDebateRounds}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Number of rounds for risk analyst debate (1-5)
              </p>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Risk Assessment Level
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
                Affects position sizing and stop-loss recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Analyst Selection */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Active Analysts</h2>
          </div>

          <p className="text-slate-400 text-sm mb-4">
            Select which analyst teams to include in your analysis. More analysts = deeper analysis but longer processing time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.selectedAnalysts).map(([analyst, enabled]) => (
              <label
                key={analyst}
                className="flex items-center gap-3 p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={e =>
                    setConfig({
                      ...config,
                      selectedAnalysts: {
                        ...config.selectedAnalysts,
                        [analyst]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium text-white capitalize">
                    {analyst === 'market'
                      ? '📊 Market Analyst'
                      : analyst === 'news'
                      ? '📰 News Analyst'
                      : analyst === 'fundamentals'
                      ? '💰 Fundamentals Analyst'
                      : '📱 Social Media Analyst'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {analyst === 'market'
                      ? 'Technical indicators, trends, and price action'
                      : analyst === 'news'
                      ? 'News sentiment and market events'
                      : analyst === 'fundamentals'
                      ? 'Balance sheet, earnings, and valuations'
                      : 'Social sentiment and trending topics'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Features & Options */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Features & Options</h2>
          </div>

          <div className="space-y-4">
            {/* Analysis Enabled */}
            <label className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition cursor-pointer">
              <div>
                <p className="font-medium text-white">Enable Analysis Engine</p>
                <p className="text-xs text-slate-400">Allow background analysis processing</p>
              </div>
              <input
                type="checkbox"
                checked={config.analysisEnabled}
                onChange={e => setConfig({ ...config, analysisEnabled: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            {/* Notifications */}
            <label className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700/70 transition cursor-pointer">
              <div>
                <p className="font-medium text-white flex items-center gap-2">
                  <Bell size={16} /> Push Notifications
                </p>
                <p className="text-xs text-slate-400">Get alerts when trading signals are generated</p>
              </div>
              <input
                type="checkbox"
                checked={config.notificationsEnabled}
                onChange={e => setConfig({ ...config, notificationsEnabled: e.target.checked })}
                className="w-4 h-4"
              />
            </label>

            {/* Data Cache */}
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
              <p className="font-medium text-white mb-3">Data Caching</p>
              <div className="flex gap-2">
                {(['enabled', 'disabled'] as const).map(cache => (
                  <button
                    key={cache}
                    onClick={() => setConfig({ ...config, dataCache: cache })}
                    className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
                      config.dataCache === cache
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cache === 'enabled' ? '✓ Enabled' : '✗ Disabled'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Cache market data to reduce API calls and improve speed
              </p>
            </div>
          </div>
        </div>

        {/* API Configuration Info */}
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-700/50 space-y-4">
          <p className="text-blue-300 font-medium">ℹ API Configuration</p>
          <p className="text-blue-200 text-sm">
            Ensure your environment variables are configured with API keys for:
          </p>
          <ul className="text-sm text-blue-200 space-y-2 ml-4">
            <li>• OpenAI API key (for LLM models)</li>
            <li>• AlphaVantage or YFinance credentials (for market data)</li>
            <li>• NewsAPI key (for news sentiment)</li>
            <li>• Database connection string (for storing results)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <Save size={18} /> Save Settings
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-sm text-slate-300">
          <p className="mb-2">
            💡 <strong>Tip:</strong> More powerful LLM models provide better analysis but cost more and take longer.
          </p>
          <p>
            🚀 <strong>Performance:</strong> Quick models are faster; Deep models are more thorough. Choose based on your needs.
          </p>
        </div>
      </div>
    </div>
  )
}
