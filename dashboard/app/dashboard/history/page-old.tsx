'use client'

import { ArrowUp, ArrowDown } from 'lucide-react'

interface AnalysisHistory {
  id: string
  company: string
  date: string
  decision: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
}

const mockHistory: AnalysisHistory[] = [
  {
    id: '1',
    company: 'TCS',
    date: '2024-01-25',
    decision: 'BUY',
    confidence: 82,
  },
  {
    id: '2',
    company: 'INFY',
    date: '2024-01-24',
    decision: 'HOLD',
    confidence: 65,
  },
  {
    id: '3',
    company: 'RELIANCE',
    date: '2024-01-23',
    decision: 'SELL',
    confidence: 71,
  },
  {
    id: '4',
    company: 'WIPRO',
    date: '2024-01-22',
    decision: 'BUY',
    confidence: 79,
  },
  {
    id: '5',
    company: 'HDFC',
    date: '2024-01-21',
    decision: 'HOLD',
    confidence: 58,
  },
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Analysis History</h1>
        <p className="text-slate-400 mb-8">Your previous trading analyses</p>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Decision
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-medium">{item.company}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${
                          item.decision === 'BUY'
                            ? 'bg-green-500/10 text-green-400'
                            : item.decision === 'SELL'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {item.decision === 'BUY' && <ArrowUp size={16} />}
                        {item.decision === 'SELL' && <ArrowDown size={16} />}
                        {item.decision}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              item.confidence > 75
                                ? 'bg-green-500'
                                : item.confidence > 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium text-sm">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
