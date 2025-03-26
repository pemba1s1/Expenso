"use client"

import { useState } from "react"
import { Search, FileText, Filter, ChevronDown, ChevronRight } from "lucide-react"
import { useUserExpenses, type Expense, type Receipt } from "@/hooks/api/useExpense"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ExpandedReceipts {
  [key: string]: boolean
}

export function TransactionList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [expandedReceipts, setExpandedReceipts] = useState<ExpandedReceipts>({})

  // Get current date for the month's expenses
  const currentDate = new Date()
  const { data: expenses = [] } = useUserExpenses(currentDate)

  const categories = [...new Set(expenses.map((e) => e.category.name))]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Group expenses by receipt
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (expense.Receipt) {
      if (!acc[expense.Receipt.id]) {
        acc[expense.Receipt.id] = {
          receipt: expense.Receipt,
          expenses: []
        }
      }
      acc[expense.Receipt.id].expenses.push(expense)
    } else {
      if (!acc['individual']) {
        acc['individual'] = {
          receipt: null,
          expenses: []
        }
      }
      acc['individual'].expenses.push(expense)
    }
    return acc
  }, {} as Record<string, { receipt: Receipt | null, expenses: Expense[] }>)

  // Filter and sort expenses
  const filteredGroups = Object.entries(groupedExpenses)
    .filter(([, group]) =>
      group.expenses.some(
        (expense) =>
          (searchTerm === "" ||
            expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.category.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedCategories.length === 0 || selectedCategories.includes(expense.category.name))
      )
    )
    .sort(([, a], [, b]) => {
      const aDate = new Date(a.expenses[0].createdAt).getTime()
      const bDate = new Date(b.expenses[0].createdAt).getTime()
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate
    })

  const toggleReceipt = (receiptId: string) => {
    setExpandedReceipts(prev => ({
      ...prev,
      [receiptId]: !prev[receiptId]
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map(([groupId, group]) => (
              <>
                {group.receipt ? (
                  // Receipt group header
                  <TableRow key={groupId} className="bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleReceipt(groupId)}
                      >
                        {expandedReceipts[groupId] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{new Date(group.receipt.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell colSpan={2}>
                      Receipt Total: ${group.receipt.totalAmount.toFixed(2)}
                      {group.receipt.taxAmount > 0 && (
                        <span className="ml-2 text-muted-foreground">
                          (Tax: ${group.receipt.taxAmount.toFixed(2)})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(group.receipt.totalAmount + group.receipt.taxAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {group.receipt.receiptImageUrl && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View receipt</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : null}
                {/* Individual expenses */}
                {(expandedReceipts[groupId] || !group.receipt) &&
                  group.expenses.map((expense) => (
                    <TableRow key={expense.id} className={group.receipt ? "bg-muted/20" : ""}>
                      <TableCell></TableCell>
                      <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category.name}</TableCell>
                      <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {!group.receipt && expense.receiptImageUrl && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View receipt</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
