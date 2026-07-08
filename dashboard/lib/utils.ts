// Utility functions for the trading dashboard

/**
 * Format a number as Indian Rupees with proper formatting
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
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
  return `${sign}${Number(value).toFixed(2)}%`
}

/**
 * Format general numbers to exactly 2 decimal places
 */
export function formatNumber(value: number): string {
  return Number(value).toFixed(2)
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

/**
 * Detect whether a summary string is actually a backend error message
 * that should never be shown to users.
 */
const ERROR_PATTERNS = [
  'temporarily unavailable',
  'api quota',
  'quota limit',
  'please try again later',
  'resource_exhausted',
  'rate limit',
  'api key',
  'stack trace',
  'backend error',
  'internal server error',
  '429',
  'timeout',
]

export function isErrorSummary(summary: string): boolean {
  if (!summary || summary.trim().length === 0) return true
  const lower = summary.toLowerCase()
  return ERROR_PATTERNS.some((pattern) => lower.includes(pattern))
}

/**
 * Generate a professional, dynamic market analysis summary from technical indicators.
 * Used as a fallback when the Gemini API is unavailable.
 */
export function generateLocalSummary({
  symbol,
  rsi,
  sma20,
  sma50,
  signal,
  latestPrice,
}: {
  symbol: string
  rsi: number
  sma20: number
  sma50: number
  signal: 'BUY' | 'SELL' | 'HOLD'
  latestPrice?: number
}): string {
  // Derive a readable stock name from the symbol
  const stockName = symbol.replace('.NS', '').replace('.BO', '')

  // RSI interpretation
  let rsiZone = 'neutral'
  let rsiDescription = ''
  if (rsi < 20) {
    rsiZone = 'deeply oversold'
    rsiDescription = `The RSI at ${rsi} places ${stockName} in deeply oversold territory, which historically precedes mean-reversion rallies. This is a technically significant level that warrants close attention from value-oriented investors.`
  } else if (rsi < 30) {
    rsiZone = 'oversold'
    rsiDescription = `The RSI of ${rsi} indicates that ${stockName} is approaching the oversold region, suggesting the recent selling pressure may be nearing exhaustion. While not yet at extreme levels, this reading signals potential for a near-term technical bounce.`
  } else if (rsi < 45) {
    rsiZone = 'slightly bearish'
    rsiDescription = `The RSI of ${rsi} indicates that ${stockName} is trading with neutral to slightly bearish momentum. The stock is approaching the oversold region but has not yet reached a strong reversal signal.`
  } else if (rsi < 55) {
    rsiZone = 'neutral'
    rsiDescription = `The RSI of ${rsi} shows ${stockName} trading in a balanced zone with neither overbought nor oversold conditions. Momentum is neutral, suggesting the stock is in a consolidation phase.`
  } else if (rsi < 70) {
    rsiZone = 'slightly bullish'
    rsiDescription = `With an RSI of ${rsi}, ${stockName} displays moderately bullish momentum. The stock has room to advance further before entering overbought territory, suggesting continued positive sentiment.`
  } else if (rsi < 80) {
    rsiZone = 'overbought'
    rsiDescription = `The RSI of ${rsi} places ${stockName} in overbought territory, indicating strong recent buying pressure. While the trend remains bullish, traders should be cautious of potential profit-taking at these elevated levels.`
  } else {
    rsiZone = 'extremely overbought'
    rsiDescription = `At an RSI of ${rsi}, ${stockName} is in extremely overbought territory. This level historically signals an elevated probability of a corrective pullback. Risk management is critical at this juncture.`
  }

  // SMA crossover analysis
  let trendAnalysis = ''
  const smaDiff = ((sma20 - sma50) / sma50) * 100
  if (sma20 > sma50) {
    if (smaDiff > 3) {
      trendAnalysis = `The 20-day SMA (${sma20.toFixed(2)}) is trading well above the 50-day SMA (${sma50.toFixed(2)}), confirming a strong bullish trend. This golden cross formation indicates sustained institutional buying interest.`
    } else {
      trendAnalysis = `The 20-day SMA (${sma20.toFixed(2)}) remains slightly above the 50-day SMA (${sma50.toFixed(2)}), suggesting a mildly bullish long-term trend despite recent weakness. The narrow spread indicates the trend may be transitioning.`
    }
  } else if (sma20 < sma50) {
    if (smaDiff < -3) {
      trendAnalysis = `The 20-day SMA (${sma20.toFixed(2)}) is trading significantly below the 50-day SMA (${sma50.toFixed(2)}), confirming a bearish death cross pattern. This suggests sustained downward pressure and caution is warranted.`
    } else {
      trendAnalysis = `The 20-day SMA (${sma20.toFixed(2)}) is slightly below the 50-day SMA (${sma50.toFixed(2)}), indicating a mildly bearish short-term trend. However, the narrow gap suggests the selling pressure may be moderating.`
    }
  } else {
    trendAnalysis = `The 20-day SMA and 50-day SMA are converging near ${sma20.toFixed(2)}, suggesting a period of consolidation. A decisive break in either direction could signal the next major trend.`
  }

  // Volatility and sentiment
  let sentiment = ''
  if (rsi < 30 && sma20 < sma50) {
    sentiment = 'Current market sentiment is bearish with oversold conditions. While the technical setup is weak, oversold readings may attract contrarian buying interest at these levels.'
  } else if (rsi > 70 && sma20 > sma50) {
    sentiment = 'Current market sentiment is strongly bullish with overbought conditions. While momentum favors the upside, elevated RSI levels suggest the risk-reward ratio is becoming less favorable for new long positions.'
  } else if (sma20 > sma50) {
    sentiment = 'Current market sentiment is neutral to slightly positive. Volatility remains moderate, and no major bearish technical breakdown is observed.'
  } else if (sma20 < sma50) {
    sentiment = 'Current market sentiment leans cautious. The bearish moving average alignment warrants monitoring, though current volatility levels remain within normal ranges.'
  } else {
    sentiment = 'Market sentiment is neutral with balanced technical signals. Volatility remains contained, and no significant directional bias is detected in the near term.'
  }

  // Price context
  let priceContext = ''
  if (latestPrice) {
    priceContext = `${stockName} is currently trading at ₹${latestPrice.toFixed(2)}. `
  }

  // Recommendation paragraph
  let recommendation = ''
  if (signal === 'BUY') {
    recommendation = `Investors may consider initiating or adding to positions, with appropriate stop-loss levels in place. The technical indicators support a favorable entry point for medium-term positions.`
  } else if (signal === 'SELL') {
    recommendation = `Investors should consider booking profits or tightening stop-losses on existing positions. The technical indicators signal elevated downside risk in the near term.`
  } else {
    recommendation = `Investors may continue holding existing positions while monitoring RSI movement and price action over the next few trading sessions. No immediate action is required based on current technical readings.`
  }

  // Assemble the full summary
  const paragraphs = [
    `${priceContext}${rsiDescription}`,
    trendAnalysis,
    sentiment,
    `Recommendation: ${signal}`,
    recommendation,
  ]

  return paragraphs.join('\n\n')
}
