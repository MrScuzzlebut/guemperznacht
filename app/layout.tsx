import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gümper Znacht - Anmeldung',
  description: 'Anmeldung für die Gümper Znacht',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
