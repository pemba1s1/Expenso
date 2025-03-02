"use client"

import { useState } from "react"
import { Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample budget data
const initialBudgetData = [
  {
    id: 1,
    category: "Groceries",
    budgeted: 500,
    spent: 420,
    remaining: 80,
    progress: 84,
  },
  {
    id: 2,
    category: "Rent",
    budgeted: 1200,
    spent: 1200,
    remaining: 0,
    progress: 100,
  },
  {
    id: 3,
    category: "Utilities",
    budgeted: 300,
    spent: 250,
    remaining: 50,
    progress: 83,
  },
  {
    id: 4,
    category: "Entertainment",
    budgeted: 200,
    spent: 180,
    remaining: 20,
    progress: 90,
  },
  {
    id: 5,
    category: "Savings",
    budgeted: 500,
    spent: 400,
    remaining: 100,
    progress: 80,
  },
  {
    id: 6,
    category: "Transportation",
    budgeted: 300,
    spent: 320,
    remaining: -20,
    progress: 107,
  },
]

export function BudgetTable() {
  const [budgetData, setBudgetData] = useState(initialBudgetData)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  const handleEdit = (id: number, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleSave = (id: number) => {
    const updatedData = budgetData.map((item) => {
      if (item.id === id) {
        const spent = item.spent
        const remaining = editValue - spent
        const progress = (spent / editValue) * 100
        return {
          ...item,
          budgeted: editValue,
          remaining,
          progress,
        }
      }
      return item
    })

    setBudgetData(updatedData)
    setEditingId(null)
  }

  const getProgressColor = (progress: number) => {
    if (progress > 100) return "bg-destructive"
    if (progress > 85) return "bg-warning"
    return "bg-primary"
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Budgeted</TableHead>
            <TableHead className="text-right">Spent</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.category}</TableCell>
              <TableCell className="text-right">
                {editingId === item.id ? (
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(Number(e.target.value))}
                    className="w-24 h-8"
                  />
                ) : (
                  `$${item.budgeted.toFixed(2)}`
                )}
              </TableCell>
              <TableCell className="text-right">${item.spent.toFixed(2)}</TableCell>
              <TableCell className={`text-right ${item.remaining < 0 ? "text-destructive" : ""}`}>
                ${item.remaining.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={item.progress > 100 ? 100 : item.progress}
                    className={`h-2 ${getProgressColor(item.progress)}`}
                  />
                  <span className="text-xs w-9">{item.progress.toFixed(0)}%</span>
                </div>
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Button variant="ghost" size="icon" onClick={() => handleSave(item.id)}>
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id, item.budgeted)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

