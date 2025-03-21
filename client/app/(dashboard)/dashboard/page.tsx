"use client"

import { useState } from "react"
import { useDashboard } from "@/hooks/use-dashboard"

import { DashboardLayout } from "./components/dashboard-layout"
import { ExpenseFormModal } from "./components/expense-form-modal"
import { DashboardSection } from "./sections/dashboard"
import { ExpensesSection } from "./sections/expenses"
import { InsightsSection } from "./sections/insights"
import { SettingsSection } from "./sections/settings"

export default function DashboardPage() {
  const { activeSection, setActiveSection } = useDashboard()
  const [showExpenseForm, setShowExpenseForm] = useState(false)

  return (
    <>
      <DashboardLayout>
        {activeSection === "dashboard" && (
          <DashboardSection 
            setShowExpenseForm={setShowExpenseForm} 
            setActiveSection={setActiveSection} 
          />
        )}

        {activeSection === "expenses" && (
          <ExpensesSection setShowExpenseForm={setShowExpenseForm} />
        )}

        {activeSection === "insights" && <InsightsSection />}
        
        {activeSection === "settings" && <SettingsSection />}
      </DashboardLayout>

      <ExpenseFormModal 
        showExpenseForm={showExpenseForm} 
        setShowExpenseForm={setShowExpenseForm} 
      />
    </>
  )
}
