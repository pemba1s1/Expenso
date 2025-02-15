import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import Header from "../components/header"
import Footer from "../components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expenso - AI-Powered Budget Tracking",
  description: "Simplify your budget with AI-powered receipt scanning and intelligent insights.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
