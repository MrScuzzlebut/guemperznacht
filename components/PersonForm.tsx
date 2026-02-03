'use client'

import { PersonData } from '@/types'

interface PersonFormProps {
  person: PersonData
  onChange: (data: Partial<PersonData>) => void
}

export default function PersonForm({ person, onChange }: PersonFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Vorname <span className="text-zunft-teal-DEFAULT">*</span>
        </label>
        <input
          type="text"
          required
          value={person.vorname}
          onChange={(e) => onChange({ vorname: e.target.value })}
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        />
      </div>

      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Name <span className="text-zunft-teal-DEFAULT">*</span>
        </label>
        <input
          type="text"
          required
          value={person.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        />
      </div>

      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Telefon <span className="text-zunft-teal-DEFAULT">*</span>
        </label>
        <input
          type="tel"
          required
          value={person.tel}
          onChange={(e) => onChange({ tel: e.target.value })}
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        />
      </div>

      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Email
        </label>
        <input
          type="email"
          value={person.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        />
      </div>

      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Option <span className="text-zunft-teal-DEFAULT">*</span>
        </label>
        <select
          required
          value={person.option}
          onChange={(e) => onChange({ option: e.target.value })}
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        >
          <option value="">Bitte wählen...</option>
          <option value="Vegi">Vegi</option>
          <option value="Vegan">Vegan</option>
          <option value="Fleisch">Fleisch</option>
        </select>
      </div>

      <div>
        <label className="block text-base font-bold text-zunft-teal-dark mb-1 font-sans">
          Allergien
        </label>
        <input
          type="text"
          value={person.allergien}
          onChange={(e) => onChange({ allergien: e.target.value })}
          placeholder="Optional"
          className="w-full px-4 py-2 border-2 border-zunft-teal-light rounded-lg focus:ring-2 focus:ring-zunft-teal-DEFAULT focus:border-zunft-teal-DEFAULT bg-white/95 text-gray-900 font-sans text-base"
        />
      </div>
    </div>
  )
}
