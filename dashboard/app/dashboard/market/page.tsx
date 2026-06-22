'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon, BellRing, Target, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface MarketIndice {
  symbol: string
  name: string
  value: number
  change: number
  changePercent: number
}

interface SectorData {
  name: string
  value: number
  stocks: string[]
}

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'gainers' | 'losers' | 'sectors'>('overview')

  // Market indices
  const marketIndices: MarketIndice[] = [
    {
      symbol: 'NIFTY 50',
      name: 'Nifty 50 Index',
      value: 24590.45,
      change: 156.35,
      changePercent: 0.64,
    },
    {
      symbol: 'SENSEX',
      name: 'BSE Sensex',
      value: 81245.78,
      change: 125.45,
      changePercent: 0.55,
    },
    {
      symbol: 'NIFTY IT',
      name: 'Nifty IT Index',
      value: 42156.80,
      change: -89.50,
      changePercent: -0.21,
    },
    {
      symbol: 'NIFTY BANK',
      name: 'Nifty Bank',
      value: 52345.60,
      change: 245.80,
      changePercent: 0.47,
    },
  ]

  // Top gainers
  const topGainers: StockData[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      price: 2859.50,
      change: 125.50,
      changePercent: 4.61,
      volume: 5234500,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3845.75,
      change: 92.25,
      changePercent: 2.45,
      volume: 2145000,
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank',
      price: 1756.80,
      change: 68.50,
      changePercent: 4.06,
      volume: 3456700,
    },
    {
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      price: 602.40,
      change: 45.20,
      changePercent: 8.11,
      volume: 1234500,
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1680.50,
      change: 35.75,
      changePercent: 2.17,
      volume: 2876000,
    },
  ]

  // Top losers
  const topLosers: StockData[] = [
    {
      symbol: 'BAJAJFINSV',
      name: 'Bajaj Finserv',
      price: 1584.20,
      change: -125.80,
      changePercent: -7.36,
      volume: 1234500,
    },
    {
      symbol: 'MARUTI',
      name: 'Maruti Suzuki',
      price: 8945.50,
      change: -98.50,
      changePercent: -1.09,
      volume: 876500,
    },
    {
      symbol: 'TATASTEEL',
      name: 'Tata Steel',
      price: 135.60,
      change: -45.40,
      changePercent: -25.07,
      volume: 2345000,
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      price: 628.75,
      change: -32.25,
      changePercent: -4.88,
      volume: 1567800,
    },
  ]

  // Sector distribution
  const sectorData: SectorData[] = [
    { name: 'IT', value: 28, stocks: ['TCS', 'INFY', 'WIPRO', 'HCLTECH'] },
    { name: 'Finance', value: 22, stocks: ['HDFC', 'ICICIBANK', 'AXISBANK', 'SBIN'] },
    { name: 'Energy', value: 18, stocks: ['RELIANCE', 'POWERGRID', 'NTPC'] },
    { name: 'Auto', value: 15, stocks: ['MARUTI', 'HERO', 'M&M'] },
    { name: 'Pharma', value: 12, stocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA'] },
    { name: 'Others', value: 5, stocks: ['Various'] },
  ]

  // Market trend data
  const marketTrendData = [
    { time: '09:00', nifty: 24400, sensex: 81050 },
    { time: '10:00', nifty: 24450, sensex: 81120 },
    { time: '11:00', nifty: 24520, sensex: 81180 },
    { time: '12:00', nifty: 24480, sensex: 81140 },
    { time: '13:00', nifty: 24560, sensex: 81240 },
    { time: '14:00', nifty: 24590, sensex: 81245 },
  ]

  const sectorColors = ['#06b6d4', '#10b981', '#a855f7', '#f43f5e', '#eab308', '#64748b']

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Market Analysis</h2>
        <p className="text-xs text-slate-400">Real-time index feeds, sector mapping, and top momentum indicators</p>
      </div>

      {/* Market Indices overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketIndices.map((indice, idx) => {
          const isIndiceUp = indice.changePercent > 0
          return (
            <motion.div
              whileHover={{ y: -2 }}
              key={idx}
              className={`glass-panel rounded-xl p-5 border border-slate-900 transition-all duration-300 flex flex-col justify-between h-32
                ${isIndiceUp ? 'glass-glow-emerald bg-emerald-500/5' : 'glass-glow-rose bg-rose-500/5'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{indice.symbol}</p>
                  <p className="text-md font-mono font-bold text-white mt-1">₹{indice.value.toLocaleString('en-IN')}</p>
                </div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-950 border border-slate-900`}>
                  {isIndiceUp ? (
                    <TrendingUp className="text-emerald-400" size={14} />
                  ) : (
                    <TrendingDown className="text-rose-400" size={14} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono mt-2">
                <span className={isIndiceUp ? 'text-emerald-400' : 'text-rose-400'}>
                  {isIndiceUp ? '+' : ''}{indice.change.toFixed(2)}
                </span>
                <span className={isIndiceUp ? 'text-emerald-400/80' : 'text-rose-400/80'}>
                  ({isIndiceUp ? '+' : ''}{indice.changePercent.toFixed(2)}%)
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Market trend chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-900 shadow-xl space-y-4">
        <h3 className="text-md font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          <span>Intraday Index Convergence</span>
        </h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
              <XAxis dataKey="time" stroke="#475569" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <YAxis stroke="#475569" style={{ fontSize: '11px', fontFamily: 'monospace' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#030712',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="nifty"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="NIFTY 50"
              />
              <Line
                type="monotone"
                dataKey="sensex"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="SENSEX"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab controls */}
      <div className="glass-panel rounded-2xl border border-slate-900 shadow-xl overflow-hidden">
        {/* Navigation bar */}
        <div className="flex border-b border-slate-900 overflow-x-auto bg-slate-950/40">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
            { id: 'losers', label: 'Top Losers', icon: TrendingDown },
            { id: 'sectors', label: 'Sector Analysis', icon: PieChartIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-semibold text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border-b-2
                ${activeTab === tab.id
                  ? 'text-blue-400 border-blue-500 bg-slate-950/60'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
                }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab display */}
        <div className="p-6">
          
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-500 rounded" />
                  <span>Market Statistics</span>
                </h4>
                
                <div className="space-y-1.5">
                  {[
                    { label: 'Total Volume', value: '8.45B', highlight: 'text-white' },
                    { label: 'Advances', value: '1,245 (62%)', highlight: 'text-emerald-400' },
                    { label: 'Declines', value: '650 (33%)', highlight: 'text-rose-400' },
                    { label: 'Unchanged', value: '95 (5%)', highlight: 'text-slate-400' },
                    { label: 'Market Cap (INR)', value: '₹385 Trillion', highlight: 'text-cyan-400' },
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="flex justify-between items-center py-2.5 border-b border-slate-900 last:border-0 text-xs">
                      <span className="text-slate-400 font-medium">{stat.label}</span>
                      <span className={`font-mono font-bold ${stat.highlight}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right pie */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-purple-500 rounded" />
                  <span>Sector Allocation</span>
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={sectorColors[index % sectorColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* 2. Top Gainers */}
          {activeTab === 'gainers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="text-left py-3.5 px-4">Symbol</th>
                    <th className="text-left py-3.5 px-4">Company</th>
                    <th className="text-right py-3.5 px-4">Price</th>
                    <th className="text-right py-3.5 px-4">Change</th>
                    <th className="text-right py-3.5 px-4">Change %</th>
                    <th className="text-right py-3.5 px-4">Volume</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-300">
                  {topGainers.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">{stock.symbol}</td>
                      <td className="py-3 px-4 text-slate-400">{stock.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-white">₹{stock.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400">
                        +₹{stock.change.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        +{stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {(stock.volume / 1000000).toFixed(2)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Top Losers */}
          {activeTab === 'losers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="text-left py-3.5 px-4">Symbol</th>
                    <th className="text-left py-3.5 px-4">Company</th>
                    <th className="text-right py-3.5 px-4">Price</th>
                    <th className="text-right py-3.5 px-4">Change</th>
                    <th className="text-right py-3.5 px-4">Change %</th>
                    <th className="text-right py-3.5 px-4">Volume</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-300">
                  {topLosers.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-900 hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">{stock.symbol}</td>
                      <td className="py-3 px-4 text-slate-400">{stock.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-white">₹{stock.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-rose-400">
                        -₹{Math.abs(stock.change).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">
                        {stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {(stock.volume / 1000000).toFixed(2)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. Sectors */}
          {activeTab === 'sectors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sectorData.map((sector, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/40 rounded-xl p-5 border border-slate-900 hover:border-slate-800 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">{sector.name} Weightage</h4>
                    <div
                      className="text-[10px] font-bold px-2 py-1 rounded text-white"
                      style={{ backgroundColor: sectorColors[idx % sectorColors.length] }}
                    >
                      {sector.value}%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sector.stocks.map((stock, sidx) => (
                      <span
                        key={sidx}
                        className="px-2.5 py-1 bg-slate-900/60 border border-slate-800/40 rounded-md text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all font-mono"
                      >
                        {stock}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* System Notifications Box */}
      <div className="glass-panel bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-slate-900 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 animate-bounce">
          <BellRing size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Market Intelligence Bulletin</h4>
          <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1 leading-relaxed">
            <li>NIFTY 50 consolidated near key resistance levels - Momentum bias: Bullish</li>
            <li>Energy and IT weightages showing robust structural inflows</li>
            <li>FII / DII net institutional inflow: Positive daily convergence</li>
          </ul>
        </div>
      </div>

    </div>
  )
}
