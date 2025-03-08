"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            If you don&apos;t see the email in your inbox, please check your spam folder.
          </p>
          <p className="text-sm text-gray-600">
            The verification link will expire in 24 hours.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/enter?tab=login" passHref>
            <Button variant="link">
              Return to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
