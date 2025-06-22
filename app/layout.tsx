import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'BitBlox Project Creator AI',
    template: '%s | BitBlox Project Creator AI',
  },
  description: 'Discover and build amazing projects with BitBlox modules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 