import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id

    const [decisionsResult, reportsResult] = await Promise.all([
      query(
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
      ),
      query(
        `SELECT 
          id,
          company_name,
          report_date,
          agent_name,
          report,
          analysis_id,
          COALESCE(score, 0.5) as score,
          created_at
        FROM agent_reports
        WHERE analysis_id = $1
        ORDER BY report_date DESC`,
        [analysisId]
      ),
    ])

    return NextResponse.json({
      analysis_id: analysisId,
      decisions: decisionsResult.rows,
      reports: reportsResult.rows,
    })
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}
