"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample spending data by category
const data = [
  { name: "Groceries", spent: 420, budget: 500 },
  { name: "Rent", spent: 1200, budget: 1200 },
  { name: "Utilities", spent: 250, budget: 300 },
  { name: "Entertainment", spent: 180, budget: 200 },
  { name: "Transportation", spent: 320, budget: 300 },
]

export function SpendingByCategory() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, ""]} />
          <Legend />
          <Bar dataKey="spent" name="Spent" fill="#0088FE" />
          <Bar dataKey="budget" name="Budget" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

