"use client"

import { useState } from "react"
import { GroupManagement } from "@/components/group-management"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/app/providers"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function SettingsForm() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false)
  
  const { user } = useAuthContext()


  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4 space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" defaultValue={user?.name || ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" defaultValue={user?.email || ""} />
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

      <TabsContent value="subscription" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Free Plan</h3>
                  <p className="text-sm text-muted-foreground">Basic features for personal use</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Up to 3 groups</li>
                    <li>• Basic expense tracking</li>
                    <li>• Limited reports</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
            
            <Popover open={showSubscriptionPopup} onOpenChange={setShowSubscriptionPopup}>
              <PopoverTrigger asChild>
                <Button className="w-full">Upgrade Subscription</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Available Plans</h4>
                    <p className="text-sm text-muted-foreground">Choose a subscription plan</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="rounded border p-2 cursor-pointer hover:bg-accent">
                      <div className="flex justify-between">
                        <h5 className="font-medium">Pro Plan</h5>
                        <p className="font-medium">$9.99</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Unlimited groups, advanced reports</p>
                    </div>
                    <div className="rounded border p-2 cursor-pointer hover:bg-accent">
                      <div className="flex justify-between">
                        <h5 className="font-medium">Business Plan</h5>
                        <p className="font-medium">$19.99</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Team features, API access, priority support</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowSubscriptionPopup(false)}>Continue</Button>
                </div>
              </PopoverContent>
            </Popover>
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
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Group Management</h3>
          <GroupManagement />
        </div>
      </TabsContent>
    </Tabs>
  )
}
