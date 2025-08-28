import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LLM Debate Console',
  description: 'Real-time split-screen debate viewer for GPT & Gemini with judge synthesis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
