import { NextRequest, NextResponse } from 'next/server'
import { RegistrationData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const data: RegistrationData = await request.json()

    if (!data.people || data.people.length === 0) {
      return NextResponse.json(
        { error: 'Keine Personen angegeben' },
        { status: 400 }
      )
    }

    // Send data to Google Apps Script
    const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

    if (!googleScriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL is not set')
      return NextResponse.json(
        { error: 'Konfigurationsfehler' },
        { status: 500 }
      )
    }

    // Format data for Google Sheets (one row per person)
    const rows = data.people.map((person) => [
      new Date().toISOString(), // Timestamp
      data.paymentIntentId,
      person.vorname,
      person.name,
      person.tel,
      person.email || '',
      person.option,
      person.allergien || '',
      data.totalAmount,
      'Bezahlt', // Payment status
    ])

    // Send to Google Apps Script
    console.log('Sending data to Google Apps Script:', {
      url: googleScriptUrl,
      rowCount: rows.length,
    })

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows }),
    })

    const responseText = await response.text()
    console.log('Google Apps Script response status:', response.status)
    console.log('Google Apps Script response:', responseText)

    if (!response.ok) {
      console.error('Google Apps Script error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      })
      throw new Error(`Fehler beim Speichern in Google Sheets: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error submitting registration:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Fehler beim Speichern der Anmeldung',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
