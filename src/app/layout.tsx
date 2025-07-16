// /app/layout.tsx
import './globals.css'
import Navbar from "@/components/header";
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}