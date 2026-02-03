'use client'

import RegistrationForm from '@/components/RegistrationForm'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Image from 'next/image'

// Get Stripe publishable key from environment
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''

// Debug: Log the key status (only first few characters for security)
if (typeof window !== 'undefined') {
  if (stripeKey) {
    console.log('✅ Stripe Key gefunden:', stripeKey.substring(0, 10) + '...')
  } else {
    console.error('❌ Stripe Key FEHLT!')
    console.error('Bitte überprüfen Sie:')
    console.error('1. .env.local Datei existiert im Projektordner')
    console.error('2. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ist darin')
    console.error('3. Dev-Server wurde NEU GESTARTET nach dem Hinzufügen')
  }
}

// Only load Stripe if key is provided
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

export default function Home() {
  // Show error if Stripe key is missing
  if (!stripeKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-zunft-teal-DEFAULT p-8 max-w-md text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-zunft-teal-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-zunft-teal-light">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zunft-teal-dark mb-2 font-sans">Konfigurationsfehler</h1>
            <p className="text-zunft-teal-dark mb-4 font-sans">
              Der Stripe Publishable Key fehlt in der Konfiguration.
            </p>
            <div className="bg-white/80 p-4 rounded text-left text-sm mb-4 border-2 border-zunft-teal-light">
              <p className="font-bold mb-2 text-zunft-teal-DEFAULT font-sans">Bitte überprüfen Sie:</p>
              <ol className="list-decimal list-inside space-y-1 text-zunft-teal-dark font-sans">
                <li>Die Datei <code className="bg-zunft-cream px-1 rounded">.env.local</code> existiert im Projektordner</li>
                <li>Sie enthält: <code className="bg-zunft-cream px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</code></li>
                <li>Der Dev-Server wurde neu gestartet nach dem Hinzufügen der Variable</li>
              </ol>
            </div>
            <div className="bg-white/80 p-4 rounded text-left text-sm border-2 border-zunft-teal-light">
              <p className="font-bold mb-2 text-zunft-teal-DEFAULT font-sans">🔍 Diagnose:</p>
              <p className="text-zunft-teal-dark mb-2 font-sans">
                Öffnen Sie diese URL im Browser, um zu prüfen, ob die Umgebungsvariablen geladen werden:
              </p>
              <a
                href="/api/check-env"
                target="_blank"
                className="text-zunft-teal-DEFAULT hover:text-zunft-teal-dark underline break-all font-sans"
              >
                http://localhost:3000/api/check-env
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise!} options={{ mode: 'payment', amount: 17000, currency: 'chf' }}>
      <div className="min-h-screen">
        {/* Dekorative Linien */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zunft-teal-DEFAULT to-transparent opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zunft-teal-DEFAULT to-transparent opacity-40"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              {/* Logo aus Design */}
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40 md:w-52 md:h-52">
                  <Image
                    src="/logo-2-gz.png"
                    alt="Gümper Znacht Logo"
                    fill
                    sizes="(max-width: 768px) 160px, 208px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Titel mit Farbverlauf wie Flyer */}
              <div className="mb-4">
                <h1 className="text-6xl md:text-7xl font-bold mb-2 font-serif tracking-wide drop-shadow-lg title-gradient">
                  GÜMPER
                </h1>
                <div className="w-32 h-1 bg-white/40 mx-auto mb-3"></div>
                <h2 className="text-5xl md:text-6xl font-bold mb-3 font-serif tracking-wide drop-shadow-lg title-gradient">
                  ZNACHT
                </h2>
                <div className="w-24 h-1 bg-white/40 mx-auto mb-4"></div>
                <p className="text-3xl md:text-4xl font-serif italic tracking-wide drop-shadow title-gradient">
                  18. April 2026
                </p>
              </div>
            </div>
            <RegistrationForm />
          </div>
        </div>
      </div>
    </Elements>
  )
}
