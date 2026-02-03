import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

if (!stripeSecretKey) {
  console.error('⚠️ STRIPE_SECRET_KEY fehlt in der Umgebung!')
}

// stripe@13 requires apiVersion '2023-08-16'
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' })
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe ist nicht konfiguriert. Bitte überprüfen Sie STRIPE_SECRET_KEY in Ihrer .env.local Datei.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount, currency, numberOfParticipants, people, totalAmount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Ungültiger Betrag' },
        { status: 400 }
      )
    }

    // Metadata für Google Sheets: bei Redirect fehlt sonst die Anmeldung (max 500 Zeichen pro Key)
    const metadata: Record<string, string> = {
      numberOfParticipants: (numberOfParticipants ?? people?.length ?? 1)?.toString(),
      totalAmount: String(totalAmount ?? 0),
    }
    if (people && Array.isArray(people)) {
      people.forEach((p: Record<string, string>, i: number) => {
        const json = JSON.stringify({
          vorname: p.vorname || '',
          name: p.name || '',
          tel: p.tel || '',
          email: p.email || '',
          option: p.option || '',
          allergien: p.allergien || '',
        })
        if (json.length <= 500) metadata[`p${i}`] = json
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'chf',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Fehler beim Erstellen der Zahlung' },
      { status: 500 }
    )
  }
}
