import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
      ORDER BY report_date DESC
      LIMIT 100`
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_name, report_date, agent_name, report, analysis_id } = body

    if (!company_name || !report_date || !agent_name || !report || !analysis_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO agent_reports (company_name, report_date, agent_name, report, analysis_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company_name, report_date, agent_name, report, analysis_id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating agent report:', error)
    return NextResponse.json(
      { error: 'Failed to create agent report' },
      { status: 500 }
    )
  }
}
