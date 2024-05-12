import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './normalize.css'
import './globals.css'

import Header from '@/app/_components/header'
import { AuthProvider } from '@/app/_hooks/useAuth'
import { CartProvider } from '@/app/_hooks/useCart'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Test project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
