// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Mi Plataforma de Gestión Personal de Conocimiento',
  description: 'Sistema para organizar y gestionar tus recursos, conocimiento y proyectos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}