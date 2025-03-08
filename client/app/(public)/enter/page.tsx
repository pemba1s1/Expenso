"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLogin, useRegister } from "@/hooks/use-auth"
import { useSearchParams } from "next/navigation"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // React Query hooks
  const login = useLogin()
  const register = useRegister()

  // Update tab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam === 'signup' ? 'signup' : 'login')
    }
  }, [tabParam])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate({ name, email, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{activeTab === 'login' ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription className="text-center">
            {activeTab === 'login' ? "Enter your credentials to access your account" : "Create an account to get started"}
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
                  disabled={login.isPending}
                >
                  {login.isPending ? "Logging in..." : "Login"}
                </Button>
                {login.isError && (
                  <p className="text-sm text-red-500 mt-2">
                    Login failed. Please check your credentials.
                  </p>
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={register.isPending}
                >
                  {register.isPending ? "Signing up..." : "Sign Up"}
                </Button>
                {register.isError && (
                  <p className="text-sm text-red-500 mt-2">
                    Registration failed. Please try again.
                  </p>
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
