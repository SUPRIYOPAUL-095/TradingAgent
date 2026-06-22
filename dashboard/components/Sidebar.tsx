'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  TrendingUp, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Market Analysis',
    href: '/dashboard/market',
    icon: TrendingUp,
  },
  {
    name: 'History',
    href: '/dashboard/history',
    icon: History,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 border-r border-slate-900 transition-all duration-300 lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-900">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="text-white" size={18} />
            </div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'}`}>
              <span className="font-bold text-white tracking-wide text-sm">QUANTUM</span>
              <span className="text-[10px] text-cyan-400 font-semibold block -mt-1 tracking-widest">TRADING</span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)] font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }
                `}
              >
                {/* Active Indicator Glow Ring */}
                {isActive && (
                  <span className="absolute left-0 w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                )}
                
                <Icon size={18} className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                
                <span className={`text-sm whitespace-nowrap transition-all duration-300
                  ${isCollapsed ? 'lg:opacity-0 lg:w-0 overflow-hidden' : 'opacity-100 w-auto'}
                `}>
                  {item.name}
                </span>

                {/* Tooltip on collapse */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none whitespace-nowrap shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer & Collapse Toggle */}
        <div className="p-3 border-t border-slate-900 flex flex-col gap-2">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg border border-slate-900 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2 text-xs"><ChevronLeft size={16} /><span>Collapse Menu</span></div>}
          </button>

          <div className="py-2 text-center overflow-hidden">
            <span className={`text-[10px] text-slate-600 block transition-all duration-300 ${isCollapsed ? 'lg:opacity-0' : 'opacity-100'}`}>
              © 2026 QUANTUM AI
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
