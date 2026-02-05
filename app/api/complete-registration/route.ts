import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' })
  : null

/**
 * Nach erfolgreicher Zahlung (auch nach Redirect): Daten aus PaymentIntent-Metadata
 * holen und an Google Sheets senden. Wird von der Success-Seite aufgerufen.
 */
export async function GET(request: NextRequest) {
  try {
    const paymentIntentId = request.nextUrl.searchParams.get('payment_intent')
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'payment_intent fehlt' },
        { status: 400 }
      )
    }

    if (!stripe || !stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe nicht konfiguriert' },
        { status: 500 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    console.log('Retrieved PaymentIntent:', paymentIntentId, 'status:', paymentIntent.status)
    console.log('Metadata:', JSON.stringify(paymentIntent.metadata))

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Zahlung nicht erfolgreich', status: paymentIntent.status },
        { status: 400 }
      )
    }

    const meta = paymentIntent.metadata || {}

    // Verhindere doppelte Verarbeitung: Prüfe ob bereits gespeichert
    if (meta.saved === 'true') {
      console.log('PaymentIntent already processed, skipping')
      return NextResponse.json({ success: true, alreadyProcessed: true })
    }

    const n = parseInt(meta.numberOfParticipants || '0', 10)
    console.log('Parsed metadata:', { numberOfParticipants: n })

    if (n === 0) {
      return NextResponse.json(
        { error: 'Keine Anmeldedaten in Zahlung gefunden', metadata: meta },
        { status: 400 }
      )
    }

    // Preis pro Person (170.-)
    const PRICE_PER_PERSON = 170

    const rows: (string | number)[][] = []
    for (let i = 0; i < n; i++) {
      const raw = meta[`p${i}`]
      if (!raw) continue
      try {
        const person = JSON.parse(raw) as Record<string, string>
        rows.push([
          new Date().toISOString(),
          paymentIntentId,
          person.vorname || '',
          person.name || '',
          person.tel || '',
          person.email || '',
          person.option || '',
          person.allergien || '',
          PRICE_PER_PERSON,
          'Bezahlt',
        ])
      } catch {
        // Einzelne Zeile überspringen bei Parse-Fehler
      }
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Keine gültigen Zeilen aus Metadata' },
        { status: 400 }
      )
    }

    const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
    if (!googleScriptUrl) {
      console.error('GOOGLE_APPS_SCRIPT_URL is not set')
      return NextResponse.json(
        { error: 'Konfigurationsfehler (Google Script URL fehlt)' },
        { status: 500 }
      )
    }

    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    })

    const responseText = await response.text()
    console.log('complete-registration → Google Script status:', response.status, responseText)

    if (!response.ok) {
      throw new Error(`Google Sheets: ${response.status} ${responseText}`)
    }

    // Markiere PaymentIntent als verarbeitet, um Duplikate zu verhindern
    try {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: { ...meta, saved: 'true' },
      })
    } catch (updateErr) {
      console.warn('Could not mark PaymentIntent as saved:', updateErr)
    }

    return NextResponse.json({ success: true, saved: rows.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    console.error('complete-registration error:', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
