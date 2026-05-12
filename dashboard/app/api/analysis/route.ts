import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company_symbol, analysis_date } = body

    if (!company_symbol || !analysis_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const analysisId = `${company_symbol}-${Date.now()}`

    // This would trigger your backend analysis pipeline
    // For now, we'll just return a response indicating the analysis has been queued
    return NextResponse.json(
      {
        analysis_id: analysisId,
        company_symbol,
        analysis_date,
        status: 'queued',
        message: 'Analysis has been queued for processing',
      },
      { status: 202 }
    )
  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    )
  }
}
