import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

if (!stripeSecretKey) {
  console.error('⚠️ STRIPE_SECRET_KEY fehlt in der Umgebung!')
}

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

    const { amount, currency, numberOfParticipants } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Ungültiger Betrag' },
        { status: 400 }
      )
    }

    // Create payment intent with metadata about number of participants
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'chf',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        numberOfParticipants: numberOfParticipants?.toString() || '1',
      },
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
