'use client'

import { useState } from 'react'
import PersonForm from './PersonForm'
import PaymentSection from './PaymentSection'
import { PersonData } from '@/types'

const PRICE_PER_PERSON = 170

export default function RegistrationForm() {
  const [people, setPeople] = useState<PersonData[]>([
    {
      vorname: '',
      name: '',
      tel: '',
      email: '',
      option: '',
      allergien: '',
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPerson = () => {
    setPeople([
      ...people,
      {
        vorname: '',
        name: '',
        tel: '',
        email: '',
        option: '',
        allergien: '',
      },
    ])
  }

  const removePerson = (index: number) => {
    if (people.length > 1) {
      setPeople(people.filter((_, i) => i !== index))
    }
  }

  const updatePerson = (index: number, data: Partial<PersonData>) => {
    const updated = [...people]
    updated[index] = { ...updated[index], ...data }
    setPeople(updated)
  }

  const validateForm = (): boolean => {
    for (const person of people) {
      if (!person.vorname.trim()) {
        setError('Bitte füllen Sie alle Pflichtfelder aus (Vorname fehlt)')
        return false
      }
      if (!person.name.trim()) {
        setError('Bitte füllen Sie alle Pflichtfelder aus (Name fehlt)')
        return false
      }
      if (!person.tel.trim()) {
        setError('Bitte füllen Sie alle Pflichtfelder aus (Telefon fehlt)')
        return false
      }
      if (!person.option) {
        setError('Bitte wählen Sie eine Option (Vegi/Vegan/Fleisch)')
        return false
      }
    }
    setError(null)
    return true
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          people,
          paymentIntentId,
          totalAmount: people.length * PRICE_PER_PERSON,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Fehler beim Speichern der Anmeldung'
        console.error('Registration submission error:', {
          status: response.status,
          error: errorData,
        })
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Registration saved successfully:', result)
      
      // Redirect to success page
      window.location.href = '/success'
    } catch (err) {
      setError('Fehler beim Speichern der Daten. Bitte kontaktieren Sie uns.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = people.length * PRICE_PER_PERSON

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-4 border-zunft-teal-DEFAULT p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-zunft-teal-dark mb-2 font-sans">
          Anmeldung
        </h3>
        <div className="w-20 h-0.5 bg-zunft-teal-DEFAULT mx-auto"></div>
      </div>

      {error && (
        <div className="bg-red-600/90 border-2 border-red-400 text-white px-4 py-3 rounded mb-4 font-sans font-bold text-base">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {people.map((person, index) => (
          <div key={index} className="border-b-2 border-zunft-teal-light/40 pb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-zunft-teal-dark font-sans">
                Person {index + 1}
              </h4>
              {people.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePerson(index)}
                  className="text-zunft-teal-DEFAULT hover:text-zunft-teal-dark text-base font-sans underline font-bold"
                >
                  Entfernen
                </button>
              )}
            </div>
            <PersonForm
              person={person}
              onChange={(data) => updatePerson(index, data)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addPerson}
          className="w-full py-3 px-4 bg-white hover:bg-zunft-teal-light/20 text-zunft-teal-dark font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-zunft-teal-DEFAULT shadow-lg font-sans text-base"
        >
          <span className="text-base">+</span>
          Person hinzufügen
        </button>

        <div className="pt-6 border-t-4 border-zunft-teal-DEFAULT">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-bold text-zunft-teal-dark font-sans">
              Gesamtbetrag:
            </span>
            <span className="text-base font-bold text-zunft-teal-dark font-sans">
              CHF {totalAmount.toFixed(2)}
            </span>
          </div>
          <p className="text-base text-zunft-teal-dark/80 mb-6 font-sans italic">
            {people.length} Person{people.length !== 1 ? 'en' : ''} × CHF {PRICE_PER_PERSON}.-
          </p>

          <PaymentSection
            amount={totalAmount}
            people={people}
            onPaymentSuccess={handlePaymentSuccess}
            onValidate={validateForm}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
