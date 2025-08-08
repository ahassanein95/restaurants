import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fool W Falafel - Authentic Middle Eastern Cuisine',
  description: 'Authentic Middle Eastern street food with a modern twist! Fresh falafels, crispy fool, and bold flavors served fast. Every bite is packed with tradition and made to satisfy your cravings instantly.',
  keywords: 'Middle Eastern food, Falafel, Shawarma, Arabic food, Restaurant, Columbus, Halal food',
  authors: [{ name: 'Fool W Falafel Restaurant' }],
  openGraph: {
    title: 'Fool W Falafel - Authentic Middle Eastern Cuisine',
    description: 'Authentic Middle Eastern street food with a modern twist! Fresh falafels, crispy fool, and bold flavors served fast.',
    url: 'https://www.foolwfalafel.com',
    siteName: 'Fool W Falafel',
    images: [
      {
        url: 'https://images.pexels.com/photos/5908050/pexels-photo-5908050.jpeg',
        width: 1200,
        height: 630,
        alt: 'Fool W Falafel Restaurant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fool W Falafel - Authentic Middle Eastern Cuisine',
    description: 'Authentic Middle Eastern street food with a modern twist!',
    images: ['https://images.pexels.com/photos/5908050/pexels-photo-5908050.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
          {children}
        </div>
      </body>
    </html>
  )
}