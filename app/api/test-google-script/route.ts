import { NextResponse } from 'next/server'

export async function GET() {
  const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  if (!googleScriptUrl) {
    return NextResponse.json({
      error: 'GOOGLE_APPS_SCRIPT_URL ist nicht gesetzt',
      exists: false,
    })
  }

  // Test with sample data
  const testRows = [
    [
      new Date().toISOString(),
      'test_payment_123',
      'Test',
      'User',
      '+41 79 123 45 67',
      'test@example.com',
      'Fleisch',
      'Keine',
      170,
      'Bezahlt',
    ],
  ]

  try {
    console.log('Testing Google Apps Script URL:', googleScriptUrl)
    
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows: testRows }),
    })

    const responseText = await response.text()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responsePreview: responseText.substring(0, 200),
      url: googleScriptUrl.substring(0, 50) + '...',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      url: googleScriptUrl.substring(0, 50) + '...',
    })
  }
}
