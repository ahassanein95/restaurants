import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Restaurant Template - Bella Vista',
  description: 'Experience authentic Italian cuisine in an elegant atmosphere',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="is-preload">
        {children}
      </body>
    </html>
  )
}