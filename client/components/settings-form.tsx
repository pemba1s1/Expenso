"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsForm() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" defaultValue="john.doe@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="w-full sm:w-auto">Update Profile</Button>
        </div>
      </TabsContent>
      <TabsContent value="api-keys" className="mt-4 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="openrouter-api-key">OpenRouter API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openrouter-api-key"
                type={apiKeyVisible ? "text" : "password"}
                placeholder="Enter your API key"
                defaultValue="sk-xxxxxxxxxxxxxxxxxxxx"
              />
              <Button variant="outline" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                {apiKeyVisible ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <Button className="w-full sm:w-auto">Save API Key</Button>
        </div>
      </TabsContent>
      <TabsContent value="payment" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment details and subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="**** **** **** ****" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="***" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name-on-card">Name on Card</Label>
              <Input id="name-on-card" placeholder="Your name" />
            </div>
            <Button className="w-full sm:w-auto">Update Payment Details</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="preferences" className="mt-4 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="default-period">Default Time Period</Label>
            <Select defaultValue="month">
              <SelectTrigger id="default-period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="budget-alerts">Budget Overspending Alerts</Label>
            <Switch id="budget-alerts" defaultChecked />
          </div>
          <Button className="w-full sm:w-auto">Save Preferences</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

