import { NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables (without exposing the actual keys)
  const hasStripePublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const hasStripeSecretKey = !!process.env.STRIPE_SECRET_KEY
  const hasGoogleScriptUrl = !!process.env.GOOGLE_APPS_SCRIPT_URL

  // Show first few characters for verification (safe to expose)
  const stripePublishableKeyPreview = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...'
    : 'FEHLT'

  return NextResponse.json({
    status: 'ok',
    environment: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
        exists: hasStripePublishableKey,
        preview: stripePublishableKeyPreview,
        length: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
      },
      STRIPE_SECRET_KEY: {
        exists: hasStripeSecretKey,
        length: process.env.STRIPE_SECRET_KEY?.length || 0,
      },
      GOOGLE_APPS_SCRIPT_URL: {
        exists: hasGoogleScriptUrl,
        preview: process.env.GOOGLE_APPS_SCRIPT_URL
          ? process.env.GOOGLE_APPS_SCRIPT_URL.substring(0, 30) + '...'
          : 'FEHLT',
      },
    },
    message: hasStripePublishableKey
      ? '✅ Umgebungsvariablen werden geladen'
      : '❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY fehlt',
  })
}
