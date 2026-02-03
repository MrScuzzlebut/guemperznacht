export interface PersonData {
  vorname: string
  name: string
  tel: string
  email: string
  option: 'Vegi' | 'Vegan' | 'Fleisch' | ''
  allergien: string
}

export interface RegistrationData {
  people: PersonData[]
  paymentIntentId: string
  totalAmount: number
}
