"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample spending data over time
const data = [
  { name: "Jan", Groceries: 450, Utilities: 280, Entertainment: 190, Transportation: 290 },
  { name: "Feb", Groceries: 470, Utilities: 290, Entertainment: 210, Transportation: 280 },
  { name: "Mar", Groceries: 480, Utilities: 300, Entertainment: 220, Transportation: 310 },
  { name: "Apr", Groceries: 500, Utilities: 300, Entertainment: 200, Transportation: 300 },
]

// Colors for the line chart
const COLORS = {
  Groceries: "#0088FE",
  Utilities: "#00C49F",
  Entertainment: "#FFBB28",
  Transportation: "#FF8042",
}

export function SpendingTrends() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
          <Legend />
          <Line type="monotone" dataKey="Groceries" stroke={COLORS.Groceries} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Utilities" stroke={COLORS.Utilities} />
          <Line type="monotone" dataKey="Entertainment" stroke={COLORS.Entertainment} />
          <Line type="monotone" dataKey="Transportation" stroke={COLORS.Transportation} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

