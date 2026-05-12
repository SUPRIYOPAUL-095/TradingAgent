import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id

    const result = await query(
      `SELECT 
        id,
        company_symbol,
        trade_date,
        decision,
        analysis_id,
        COALESCE(confidence, 0.5) as confidence,
        created_at
      FROM final_trading_decisions
      WHERE analysis_id = $1
      ORDER BY trade_date DESC`,
      [analysisId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching trading decisions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading decisions' },
      { status: 500 }
    )
  }
}
