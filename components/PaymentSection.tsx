'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { PersonData } from '@/types'

interface PaymentSectionProps {
  amount: number
  people: PersonData[]
  onPaymentSuccess: (paymentIntentId: string) => void
  onValidate: () => boolean
  isSubmitting: boolean
}

export default function PaymentSection({
  amount,
  people,
  onPaymentSuccess,
  onValidate,
  isSubmitting,
}: PaymentSectionProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!onValidate()) {
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      // IMPORTANT: Submit elements first before creating payment intent
      // This validates the payment form
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setPaymentError(submitError.message || 'Fehler bei der Zahlungsvalidierung')
        setIsProcessing(false)
        return
      }

      // Create payment intent with number of participants
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'chf',
          numberOfParticipants: people.length,
        }),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Zahlung')
      }

      const { clientSecret } = await response.json()

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        setPaymentError(confirmError.message || 'Zahlungsfehler')
        setIsProcessing(false)
        return
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id)
      }
    } catch (err) {
      setPaymentError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!stripe) {
    return (
      <div className="bg-zunft-teal-light/30 p-4 rounded-lg text-center text-zunft-teal-dark border-2 border-zunft-teal-DEFAULT font-sans font-bold text-base">
        Zahlung wird geladen...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-lg border-2 border-zunft-teal-light">
        <PaymentElement />
      </div>

      {paymentError && (
        <div className="bg-red-600/90 border-2 border-red-400 text-white px-4 py-3 rounded font-sans font-bold text-base">
          {paymentError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || isSubmitting}
        className="w-full py-4 px-6 bg-white hover:bg-zunft-teal-light/20 disabled:bg-gray-200 disabled:cursor-not-allowed text-zunft-teal-dark font-bold text-base rounded-lg transition-colors border-2 border-zunft-teal-DEFAULT shadow-lg font-sans"
      >
        {isProcessing || isSubmitting
          ? 'Wird verarbeitet...'
          : `Jetzt bezahlen (CHF ${amount.toFixed(2)})`}
      </button>
    </form>
  )
}
