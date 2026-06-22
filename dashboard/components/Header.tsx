'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Sun, Menu, Globe, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Header({ onMenuClick, isSidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [timeStr, setTimeStr] = useState('')
  const [isMarketOpen, setIsMarketOpen] = useState(false)

  // Live clock and market status checker
  useEffect(() => {
    const updateTimeAndStatus = () => {
      // Get current date/time in India timezone
      const indianTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      
      // Format time string: e.g. "22 Jun 2026, 12:00:33 PM"
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }
      setTimeStr(indianTime.toLocaleString('en-IN', options))

      // Check if NSE market is open: Mon-Fri, 9:15 AM to 3:30 PM
      const day = indianTime.getDay() // 0 = Sun, 6 = Sat
      const hours = indianTime.getHours()
      const minutes = indianTime.getMinutes()
      const timeInMinutes = hours * 60 + minutes

      const isWeekday = day >= 1 && day <= 5
      const isMarketHours = timeInMinutes >= (9 * 60 + 15) && timeInMinutes <= (15 * 60 + 30)

      setIsMarketOpen(isWeekday && isMarketHours)
    }

    updateTimeAndStatus()
    const timer = setInterval(updateTimeAndStatus, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all duration-300">
      {/* Left side: Hamburger (mobile) / Expand Toggle (desktop) / Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        <div className="hidden lg:flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Gemini AI</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Terminal v1.2
            </span>
          </h1>
        </div>
      </div>

      {/* Middle: Live Market Indicator & Time */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-3 py-1.5">
          <span className={`relative flex h-2 w-2`}>
            {isMarketOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isMarketOpen ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
          </span>
          <span className="text-xs font-semibold text-slate-300">
            {isMarketOpen ? 'NSE LIVE' : 'NSE CLOSED'}
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400 select-none bg-slate-900/30 border border-slate-800/40 rounded px-2.5 py-1">
          {timeStr || 'Loading clock...'}
        </div>
      </div>

      {/* Right side: Search, Theme, Profile */}
      <div className="flex items-center gap-4">
        {/* Mock Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
          <input
            type="text"
            placeholder="Search stock, sector..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/60 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-blue-500/60 transition-all"
          />
        </div>

        {/* Global indicator button */}
        <div className="flex items-center gap-1.5">
          <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
          </button>
          <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors">
            <Sun size={16} />
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-900">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/10">
            TR
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-white">Trader Portfolio</div>
            <div className="text-[10px] text-slate-500">Recruiter Access</div>
          </div>
        </div>
      </div>
    </header>
  )
}
