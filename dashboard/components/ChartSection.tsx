'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ChartSectionProps {
  data?: Array<{ date: string; price: number }>
}

export default function ChartSection({ data }: ChartSectionProps) {
  if (!data || data.length === 0) return null

  const chartData = data

  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const avgPrice = Math.round(chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length)

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Price Trend</h3>
          <p className="text-slate-400 text-sm mt-1">Last 10 trading days</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Average</p>
            <p className="text-lg font-bold text-blue-400">{formatCurrency(avgPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">Range</p>
            <p className="text-lg font-bold text-slate-300">
              {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Price']}
            />
            <ReferenceLine
              y={avgPrice}
              stroke="#6366f1"
              strokeDasharray="5 5"
              opacity={0.5}
              label={{ value: `Avg: ${formatCurrency(avgPrice)}`, position: 'right', fill: '#6366f1', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">High</p>
          <p className="text-lg font-bold text-green-400">{formatCurrency(maxPrice)}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Low</p>
          <p className="text-lg font-bold text-red-400">{formatCurrency(minPrice)}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Average</p>
          <p className="text-lg font-bold text-blue-400">{formatCurrency(avgPrice)}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-slate-400 text-xs mb-2">Change</p>
          <p className={`text-lg font-bold ${chartData[chartData.length - 1].price > chartData[0].price ? 'text-green-400' : 'text-red-400'}`}>
            {chartData[chartData.length - 1].price > chartData[0].price ? '+' : '-'}
            {formatCurrency(Math.abs(chartData[chartData.length - 1].price - chartData[0].price))}
          </p>
        </div>
      </div>
    </div>
  )
}
