'use client'

import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, ArrowUpRight, ArrowDownRight, CalendarRange, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChartSectionProps {
  data?: Array<{ date: string; price: number }>
}

export default function ChartSection({ data }: ChartSectionProps) {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | 'ALL'>('ALL')

  if (!data || data.length === 0) return null

  // Sort data by date just in case
  const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Filter data based on selected timeRange (mock slicing for interactive feel)
  let filteredData = chartData
  if (timeRange === '1D') {
    filteredData = chartData.slice(-2) // Show last 2 trading periods
  } else if (timeRange === '1W') {
    filteredData = chartData.slice(-5) // Show last 5 trading periods
  } else if (timeRange === '1M') {
    filteredData = chartData.slice(-10) // Show last 10 trading periods
  }

  const prices = filteredData.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length)

  const firstPrice = filteredData[0]?.price || 0
  const lastPrice = filteredData[filteredData.length - 1]?.price || 0
  const priceDiff = lastPrice - firstPrice
  const percentChange = firstPrice > 0 ? (priceDiff / firstPrice) * 100 : 0
  const isUp = priceDiff >= 0

  // Aesthetic colors
  const strokeColor = isUp ? '#10b981' : '#f43f5e'
  const gradientColor = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'

  // Format date labels
  const formatXAxis = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    } catch {
      return dateStr
    }
  }

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0].payload
      const itemPrice = current.price
      const diffFromStart = itemPrice - firstPrice
      const pChange = firstPrice > 0 ? (diffFromStart / firstPrice) * 100 : 0

      return (
        <div className="bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {new Date(current.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-white">₹{itemPrice.toLocaleString('en-IN')}</span>
            <span className={`text-[10px] font-bold flex items-center ${diffFromStart >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {diffFromStart >= 0 ? '+' : ''}{pChange.toFixed(2)}%
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-900/60 shadow-xl space-y-6">
      
      {/* Header controls & stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className={isUp ? 'text-emerald-400' : 'text-rose-400'} />
            <span>Interactive Price Action</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Live market data for historical backtest periods</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-900">
          {(['1D', '1W', '1M', 'ALL'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all
                ${timeRange === range
                  ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-950/30 border border-slate-900/60 rounded-xl">
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Period End</span>
          <div className="text-lg font-mono font-bold text-white mt-0.5">
            ₹{lastPrice.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Period Change</span>
          <div className={`text-lg font-mono font-bold flex items-center gap-1 mt-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{isUp ? '+' : ''}{percentChange.toFixed(2)}%</span>
            {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Historical average</span>
          <div className="text-lg font-mono font-bold text-blue-400 mt-0.5">
            ₹{avgPrice.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Session Spread</span>
          <div className="text-lg font-mono font-bold text-slate-300 mt-0.5">
            ₹{Math.round(maxPrice - minPrice)}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="h-80 w-full pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              stroke="#475569" 
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#475569" 
              style={{ fontSize: '11px', fontFamily: 'monospace' }} 
              domain={['auto', 'auto']}
              tickFormatter={(v) => `₹${Math.round(v)}`}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            
            {/* Average Indicator Line */}
            <ReferenceLine
              y={avgPrice}
              stroke="#3b82f6"
              strokeDasharray="4 4"
              opacity={0.3}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill="url(#chartGradient)"
              animationDuration={600}
              dot={{ fill: strokeColor, strokeWidth: 1, r: 2.5 }}
              activeDot={{ r: 5, strokeWidth: 0, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Range Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2.5 bg-slate-950/20 border border-slate-900 rounded-lg">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Session High</p>
          <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">₹{maxPrice.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center p-2.5 bg-slate-950/20 border border-slate-900 rounded-lg">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Session Low</p>
          <p className="text-xs font-mono font-bold text-rose-400 mt-0.5">₹{minPrice.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center p-2.5 bg-slate-950/20 border border-slate-900 rounded-lg">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Indicators Spread</p>
          <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">₹{avgPrice.toLocaleString('en-IN')}</p>
        </div>
      </div>

    </div>
  )
}
