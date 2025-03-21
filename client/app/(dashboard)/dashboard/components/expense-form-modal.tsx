"use client"

import { Button } from "@/components/ui/button"
import { ExpenseForm } from "@/components/expense-form"

interface ExpenseFormModalProps {
  showExpenseForm: boolean
  setShowExpenseForm: (show: boolean) => void
}

export function ExpenseFormModal({ showExpenseForm, setShowExpenseForm }: ExpenseFormModalProps) {
  if (!showExpenseForm) return null

  return (
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
  )
}
