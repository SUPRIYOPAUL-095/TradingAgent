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
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching agent reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agent reports' },
      { status: 500 }
    )
  }
}
