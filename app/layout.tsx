import type { Metadata } from 'next'
import './globals.css'
import GlobalBackButton from '@/components/GlobalBackButton'

export const metadata: Metadata = {
  title: 'MOVETI Social',
  description: 'Music, creators, videos and community.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body><GlobalBackButton />{children}</body>
    </html>
  )
}
