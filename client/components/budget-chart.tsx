"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Sample budget data
const data = [
  { name: "Groceries", value: 500 },
  { name: "Rent", value: 1200 },
  { name: "Utilities", value: 300 },
  { name: "Entertainment", value: 200 },
  { name: "Savings", value: 500 },
  { name: "Transportation", value: 300 },
  { name: "Other", value: 200 },
]

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FCCDE5"]

export function BudgetChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, "Budget"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

