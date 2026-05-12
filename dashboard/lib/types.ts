export interface TradingDecision {
  id: string
  symbol: string
  action: string
  confidence: number
  reasoning?: string
  created_at?: string
}

export interface AgentReport {
  id: string
  agent_name: string
  report: string
  created_at?: string
}
