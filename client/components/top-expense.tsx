"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample top expenses data
const topExpenses = [
  {
    id: 1,
    description: "Monthly Rent",
    category: "Rent",
    amount: 1200.0,
    date: "2025-04-14",
  },
  {
    id: 2,
    description: "Electric Bill",
    category: "Utilities",
    amount: 95.4,
    date: "2025-04-13",
  },
  {
    id: 3,
    description: "Grocery Store",
    category: "Groceries",
    amount: 78.35,
    date: "2025-04-15",
  },
  {
    id: 4,
    description: "Internet Bill",
    category: "Utilities",
    amount: 79.99,
    date: "2025-04-05",
  },
  {
    id: 5,
    description: "Restaurant Dinner",
    category: "Entertainment",
    amount: 68.2,
    date: "2025-04-03",
  },
]

export function TopExpenses() {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

