'use client'

import { useState } from 'react'
import { Bell, Moon, Lock, Database } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    twoFactor: false,
    dataExport: false,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const settingsList = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Receive alerts for trading signals and market updates',
      key: 'notifications' as const,
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Use dark theme for reduced eye strain',
      key: 'darkMode' as const,
    },
    {
      icon: Lock,
      title: 'Two-Factor Authentication',
      description: 'Add extra security to your account',
      key: 'twoFactor' as const,
    },
    {
      icon: Database,
      title: 'Data Export',
      description: 'Export your analysis history and data',
      key: 'dataExport' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400 mb-8">Manage your preferences and account settings</p>

        <div className="space-y-4">
          {settingsList.map((setting) => {
            const Icon = setting.icon
            return (
              <div
                key={setting.key}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 flex items-center justify-between hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700/30 rounded-lg flex items-center justify-center">
                    <Icon className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{setting.title}</h3>
                    <p className="text-slate-400 text-sm">{setting.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(setting.key)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    settings[setting.key] ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      settings[setting.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50">
            Save Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Danger Zone</h2>
          <button className="w-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-medium py-3 rounded-lg transition-all duration-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
