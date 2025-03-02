"use client"

import { useState } from "react"
import { BarChart, CreditCard, DollarSign, Download, Home, Plus, Settings, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { BudgetTable } from "@/components/budget-table"
import { ExpenseForm } from "@/components/expense-form"
import { TransactionList } from "@/components/transaction-list"
import { BudgetChart } from "@/components/budget-chart"
import { SpendingTrends } from "@/components/spending-trends"
import { SpendingByCategory } from "@/components/spending-by-category"
import { TopExpenses } from "@/components/top-expense"
import { SettingsForm } from "@/components/settings-form"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-screen bg-muted/40">
          <Sidebar>
            <SidebarContent>
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-semibold">Expenso</span>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeSection === "dashboard"}
                    onClick={() => setActiveSection("dashboard")}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "expenses"} onClick={() => setActiveSection("expenses")}>
                    <CreditCard className="h-4 w-4" />
                    <span>Expenses</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "insights"} onClick={() => setActiveSection("insights")}>
                    <BarChart className="h-4 w-4" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeSection === "settings"} onClick={() => setActiveSection("settings")}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {activeSection === "dashboard" && "Dashboard"}
                  {activeSection === "expenses" && "Expense Tracking"}
                  {activeSection === "insights" && "Insights & Reports"}
                  {activeSection === "settings" && "Settings"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="april">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January 2023</SelectItem>
                    <SelectItem value="february">February 2023</SelectItem>
                    <SelectItem value="march">March 2023</SelectItem>
                    <SelectItem value="april">April 2023</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User account</span>
                </Button>
              </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
              {activeSection === "dashboard" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$4,550.00</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$3,200.00</div>
                        <p className="text-xs text-muted-foreground">For April 2023</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$2,450.00</div>
                        <p className="text-xs text-muted-foreground">76.5% of budget</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$750.00</div>
                        <div className="mt-2">
                          <Progress value={76.5} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Card className="flex-1">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Budget Planning</CardTitle>
                          <CardDescription>Manage your budget allocations</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <BudgetTable />
                      </CardContent>
                    </Card>
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Budget Allocation</CardTitle>
                        <CardDescription>How your budget is distributed</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <BudgetChart />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex gap-4">
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-4">
                        <Button onClick={() => setShowExpenseForm(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Expense
                        </Button>
                        <Button variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Receipt
                        </Button>
                        <Button variant="outline" onClick={() => setActiveSection("expenses")}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          View Transactions
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {activeSection === "expenses" && (
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Expense Tracking</CardTitle>
                          <CardDescription>Manage and track your expenses</CardDescription>
                        </div>
                        <Button onClick={() => setShowExpenseForm(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Expense
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TransactionList />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "insights" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Spending Trends</CardTitle>
                      <CardDescription>Your spending patterns over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SpendingTrends />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending by Category</CardTitle>
                      <CardDescription>How your spending is distributed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SpendingByCategory />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Expenses</CardTitle>
                      <CardDescription>Your largest expenses this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopExpenses />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SettingsForm />
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
        {showExpenseForm && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add Expense</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowExpenseForm(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <ExpenseForm onClose={() => setShowExpenseForm(false)} />
            </div>
          </div>
        )}
      </SidebarProvider>
    </>
  )
}

