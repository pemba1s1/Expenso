"use client"

import { useState, useEffect } from "react"
import { useGroupStore } from "@/stores/useGroupStore"
import { useMonthStore } from "@/stores/useMonthStore"
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

  const selectedGroup = useGroupStore((state) => state.selectedGroup)
  const monthStore = useMonthStore()

  // Debug changes to query parameters
  useEffect(() => {
    console.log('Expense query parameters:', { 
      year: monthStore.selectedYear,
      month: monthStore.getMonthName(),
      groupId: selectedGroup?.id
    })
  }, [monthStore.selectedYear, monthStore.selectedMonth, selectedGroup])

  const { data: receipts = [] } = useUserExpenses(
    monthStore.selectedYear,
    monthStore.getMonthName(),
    selectedGroup?.id
  )

  // Get unique categories from all expenses across all receipts
  const categories = [...new Set(receipts.flatMap(receipt => 
    receipt.expenses.map(expense => expense.category.name)
  ))]

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Create a map of receipts with their expenses
  const groupedExpenses = receipts.reduce((acc, receipt) => {
    acc[receipt.id] = {
      receipt,
      expenses: receipt.expenses
    }
    return acc
  }, {} as Record<string, { receipt: Receipt, expenses: Expense[] }>)

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
      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
      <div className="space-y-4">
        {filteredGroups.map(([groupId, group]) => (
          <div key={groupId} className="rounded-md border overflow-hidden">
            {/* Receipt Header */}
            <div 
              className="bg-muted/50 p-3 sm:p-4 cursor-pointer"
              onClick={() => toggleReceipt(groupId)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex-1 flex items-start sm:items-center gap-2">
                  {expandedReceipts[groupId] ? (
                    <ChevronDown className="h-4 w-4 mt-1 sm:mt-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mt-1 sm:mt-0" />
                  )}
                  <div>
                    <div className="font-medium text-sm sm:text-base flex flex-wrap gap-x-1">
                      <span>{new Date(group.receipt.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>${group.receipt.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-x-1">
                      <span>{group.expenses.length} items</span>
                      {group.receipt.taxAmount > 0 && (
                        <>
                          <span>•</span>
                          <span>Tax: ${group.receipt.taxAmount.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {group.receipt.receiptImageUrl && (
                  <a 
                    href={group.receipt.receiptImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground border sm:border-0 rounded p-1 sm:p-0"
                  >
                    <FileText className="h-4 w-4" />
                    View Receipt
                  </a>
                )}
              </div>
            </div>

            {/* Expenses Table */}
            {expandedReceipts[groupId] && (
              <div className="px-2 py-1 sm:p-4">
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Description</TableHead>
                        <TableHead className="text-xs sm:text-sm">Category</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.expenses.map((expense) => (
                        <TableRow key={expense.id} className="text-xs sm:text-sm">
                          <TableCell className="py-1.5 sm:py-4 pr-2 break-words">{expense.description}</TableCell>
                          <TableCell className="py-1.5 sm:py-4 px-2 break-words">{expense.category.name}</TableCell>
                          <TableCell className="text-right py-1.5 sm:py-4 pl-2 whitespace-nowrap">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
