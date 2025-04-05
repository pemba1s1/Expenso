"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLogin, useRegister } from "@/hooks/use-auth"
import { useAcceptInvitation } from "@/hooks/api/useInvitation"
import { useSearchParams } from "next/navigation"

// Component that uses useSearchParams wrapped in Suspense
function AuthContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const invitationType = searchParams.get('type')
  const invitationId = searchParams.get('invitationId')
  const [activeTab, setActiveTab] = useState(
    invitationType === 'register' || tabParam === 'signup' ? 'signup' : 'login'
  )
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // React Query mutations
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const acceptInvitation = useAcceptInvitation()

  // Update tab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam === 'signup' ? 'signup' : 'login')
    } else if (invitationType) {
      setActiveTab(invitationType === 'register' ? 'signup' : 'login')
    }
  }, [tabParam, invitationType])

  const handleTabChange = (value: string) => {
    setEmail("")
    setPassword("")
    setName("")
    setConfirmPassword("")
    setPasswordError("")
    setActiveTab(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (confirmPassword == "") return;
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      
      // If this was an invitation flow, accept the invitation
      if (invitationId) {
        await acceptInvitation.mutateAsync({ invitationId });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return;
    }
    try {
      await registerMutation.mutateAsync({ name, email, password });
      
      // If this was an invitation flow, accept the invitation with name
      if (invitationId) {
        await acceptInvitation.mutateAsync({ 
          invitationId,
          password,
          name
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{activeTab === 'login' ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription className="text-center">
            {invitationId 
              ? `${activeTab === 'login' ? "Login" : "Create an account"} to join the group`
              : activeTab === 'login' 
                ? "Enter your credentials to access your account" 
                : "Create an account to get started"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="***********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending || acceptInvitation.isPending}
                >
                  {loginMutation.isPending || acceptInvitation.isPending ? "Processing..." : "Login"}
                </Button>
                {loginMutation.error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 mt-2">
                    <p className="text-sm text-red-600">
                      {loginMutation.error}
                    </p>
                  </div>
                )}
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="First Last"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    placeholder="***********"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    placeholder="***********"
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={registerMutation.isPending || acceptInvitation.isPending}
                >
                  {registerMutation.isPending || acceptInvitation.isPending ? "Processing..." : "Sign Up"}
                </Button>
                {(passwordError || registerMutation.error) && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 mt-2">
                    <p className="text-sm text-red-600">
                      {passwordError || registerMutation.error}
                    </p>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => handleTabChange(activeTab === 'login' ? "signup" : "login")}
            >
              {activeTab === 'login' ? "Sign up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Main component that wraps AuthContent in Suspense
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
