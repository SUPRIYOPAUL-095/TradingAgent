import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
      ORDER BY trade_date DESC
      LIMIT 100`
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_symbol, trade_date, decision, analysis_id } = body

    if (!company_symbol || !trade_date || !decision || !analysis_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await query(
      `INSERT INTO final_trading_decisions (company_symbol, trade_date, decision, analysis_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [company_symbol, trade_date, decision, analysis_id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating trading decision:', error)
    return NextResponse.json(
      { error: 'Failed to create trading decision' },
      { status: 500 }
    )
  }
}
