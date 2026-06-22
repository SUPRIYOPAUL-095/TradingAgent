'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon } from 'lucide-react'

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
  const [loading, setLoading] = useState(false)

  // Mock market indices data
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

  // Mock top gainers
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

  // Mock top losers
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

  // Mock sector data
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

  const sectorColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Market Analysis</h1>
          <p className="text-slate-400">Real-time market insights and sector performance</p>
        </div>

        {/* Market Indices Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {marketIndices.map((indice, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">{indice.symbol}</p>
                  <p className="text-white font-bold text-lg">{indice.value.toFixed(2)}</p>
                </div>
                {indice.changePercent > 0 ? (
                  <TrendingUp className="text-green-400" size={24} />
                ) : (
                  <TrendingDown className="text-red-400" size={24} />
                )}
              </div>
              <div className="flex gap-2">
                <span
                  className={`text-xm font-semibold ${
                    indice.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {indice.changePercent > 0 ? '+' : ''}
                  {indice.change.toFixed(2)}
                </span>
                <span
                  className={`text-xs ${
                    indice.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ({indice.changePercent > 0 ? '+' : ''}
                  {indice.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Market Trend Chart */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Market Trend (Today)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nifty"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="NIFTY 50"
                />
                <Line
                  type="monotone"
                  dataKey="sensex"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="SENSEX"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Data Tabs */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
              { id: 'losers', label: 'Top Losers', icon: TrendingDown },
              { id: 'sectors', label: 'Sector Analysis', icon: PieChartIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Market Stats */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">Market Statistics</h3>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">Total Volume</span>
                    <span className="text-white font-semibold">8.45B</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">Advances</span>
                    <span className="text-green-400 font-semibold">1,245 (62%)</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">Declines</span>
                    <span className="text-red-400 font-semibold">650 (33%)</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">Unchanged</span>
                    <span className="text-slate-400 font-semibold">95 (5%)</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-400">Market Cap (INR)</span>
                    <span className="text-blue-400 font-semibold">₹385 Trillion</span>
                  </div>
                </div>

                {/* Sector Distribution */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Sector Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={100}
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

            {/* Top Gainers Table */}
            {activeTab === 'gainers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Change</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Change %</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topGainers.map((stock, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-white">{stock.symbol}</td>
                        <td className="py-3 px-4 text-slate-300">{stock.name}</td>
                        <td className="py-3 px-4 text-right text-white">₹{stock.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-green-400 font-semibold">
                          +₹{stock.change.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-green-400 font-semibold">
                          +{stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {(stock.volume / 1000000).toFixed(2)}M
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top Losers Table */}
            {activeTab === 'losers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Company</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Change</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Change %</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLosers.map((stock, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-white">{stock.symbol}</td>
                        <td className="py-3 px-4 text-slate-300">{stock.name}</td>
                        <td className="py-3 px-4 text-right text-white">₹{stock.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-red-400 font-semibold">
                          -₹{Math.abs(stock.change).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-red-400 font-semibold">
                          {stock.changePercent.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {(stock.volume / 1000000).toFixed(2)}M
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sector Analysis */}
            {activeTab === 'sectors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorData.map((sector, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/20 rounded-lg p-6 border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{sector.name}</h3>
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: sectorColors[idx] }}
                      >
                        {sector.value}%
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sector.stocks.map((stock, sidx) => (
                        <span
                          key={sidx}
                          className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
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

        {/* Market Alerts */}
        <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Market Alerts</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ NIFTY 50 crossed 24,500 level - Strong bullish momentum</li>
            <li>✓ IT sector showing strength with 3.2% gains</li>
            <li>⚠ Banking sector experiencing profit booking</li>
            <li>ℹ FII inflow: ₹2,450 Cr (today)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
