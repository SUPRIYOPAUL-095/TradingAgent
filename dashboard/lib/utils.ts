// Utility functions for the trading dashboard

/**
 * Format a number as Indian Rupees with proper formatting
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get decision color class based on decision type
 */
export function getDecisionColor(
  decision: 'BUY' | 'SELL' | 'HOLD'
): {
  bg: string
  text: string
  border: string
} {
  const colors = {
    BUY: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/30',
    },
    SELL: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/30',
    },
    HOLD: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
    },
  }
  return colors[decision]
}

/**
 * Get risk color based on risk level
 */
export function getRiskColor(
  risk: 'Low' | 'Medium' | 'High'
): string {
  const colors = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-red-400',
  }
  return colors[risk]
}

/**
 * Validate stock symbol format
 */
export function validateStockSymbol(symbol: string): boolean {
  const pattern = /^[A-Z0-9.-]{1,20}$/
  return pattern.test(symbol)
}

/**
 * Generate mock price data for charts
 */
export function generateMockPriceData(startPrice: number = 2300, days: number = 10) {
  const data = []
  const dates = [
    '20 Jan',
    '21 Jan',
    '22 Jan',
    '23 Jan',
    '24 Jan',
    '25 Jan',
    '26 Jan',
    '27 Jan',
    '28 Jan',
    '29 Jan',
  ]

  let price = startPrice
  for (let i = 0; i < days; i++) {
    // Random price variation between -2% and +3%
    const change = (Math.random() - 0.3) * 50
    price = Math.max(price + change, startPrice * 0.8)
    data.push({
      date: dates[i] || `Day ${i + 1}`,
      price: Math.round(price),
    })
  }
  return data
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Local storage utility
 */
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  },
}
