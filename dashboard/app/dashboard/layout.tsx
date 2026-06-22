'use client'

import { useState } from 'react'
import { Sidebar, Header } from '@/components'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Container */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
          ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
        `}
      >
        {/* Top Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Content Viewport */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
