'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status')
    const paymentIntent = searchParams.get('payment_intent')

    if (redirectStatus !== 'succeeded') {
      router.replace('/')
      return
    }

    // Anmeldung aus Zahlungs-Metadaten in Google Sheets speichern (funktioniert auch nach Redirect)
    if (!paymentIntent) {
      setShowSuccess(true)
      return
    }

    fetch(`/api/complete-registration?payment_intent=${encodeURIComponent(paymentIntent)}`)
      .then((res) => {
        if (res.ok) {
          setShowSuccess(true)
          setSaveError(null)
        } else {
          return res.json().then((data) => {
            setSaveError(data.error || 'Fehler beim Speichern')
            setShowSuccess(true)
          })
        }
      })
      .catch(() => {
        setSaveError('Fehler beim Speichern der Anmeldung')
        setShowSuccess(true)
      })
  }, [searchParams, router])

  if (!showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-zunft-teal-DEFAULT p-8 max-w-2xl w-full mx-4 text-center">
          <p className="text-[#2E5077] font-sans">Wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Dekorative Linien */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zunft-teal-DEFAULT to-transparent opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zunft-teal-DEFAULT to-transparent opacity-40"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-zunft-teal-DEFAULT p-8 max-w-2xl w-full mx-4 text-center relative z-10">
        {/* Logo – transparent auf Karte, Logo_GZ */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="/logo-2-gz.png"
              alt="Gümper Znacht Logo"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Success Icon – Häkchen blau */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#E8F4FC] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#2E5077]">
            <svg
              className="w-10 h-10 text-[#2E5077]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Titel */}
        <h1 className="text-4xl md:text-5xl font-bold text-zunft-teal-dark mb-4 font-sans drop-shadow">
          Anmeldung erfolgreich!
        </h1>
        <div className="w-24 h-1 bg-zunft-teal-DEFAULT mx-auto mb-6"></div>

        {/* Nachricht */}
        <div className="space-y-4 mb-8 text-left">
          <p className="text-zunft-teal-dark text-lg md:text-xl font-sans leading-relaxed">
            Du und alle angegebenen Personen sind somit angemeldet! Schön bist Du dabei!
          </p>
          <p className="text-zunft-teal-dark text-lg md:text-xl font-sans leading-relaxed">
            Weitere Informationen werden zeitnah via WhatsApp geteilt.
          </p>
          <div className="pt-4">
            <p className="text-zunft-teal-dark text-lg md:text-xl font-sans leading-relaxed">
              Wir freuen uns auf Dich!
            </p>
          </div>
        </div>

        {/* Unterschrift */}
        <div className="border-t-2 border-zunft-teal-light/50 pt-6 mb-8">
          <p className="text-[#2E5077] text-lg font-sans italic">
            Aline, Dominique, Yannick & Moritz
          </p>
        </div>

        {saveError && (
          <p className="text-red-600 text-sm font-sans mb-4">
            Zahlung war erfolgreich. Beim Speichern in die Liste ist ein Fehler aufgetreten – bitte kontaktiere uns.
          </p>
        )}

        {/* Button – Text blau */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 px-6 bg-white hover:bg-[#E8F4FC] text-[#2E5077] font-bold rounded-lg transition-colors border-2 border-[#2E5077] shadow-lg font-sans"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  )
}

function SuccessFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-zunft-teal-DEFAULT p-8 max-w-2xl w-full mx-4 text-center">
        <p className="text-[#2E5077] font-sans">Wird geladen...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
