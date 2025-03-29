"use client"

import type React from "react"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddExpense } from "@/hooks/api/useExpense"
import { useGroupStore } from "@/stores/useGroupStore"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/hooks/api/useCategory"

interface ExpenseFormProps {
  onClose: () => void
}

export function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { toast } = useToast()
  const { selectedGroup } = useGroupStore()
  const { mutate: addExpense, isPending } = useAddExpense()
  const { data: categories } = useCategories()
  const queryClient = useQueryClient()

  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Receipt image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      setReceiptFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setReceiptPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGroup) {
      toast({
        title: "Error",
        description: "Please select a group first",
        variant: "destructive",
      })
      return
    }

    if (!description || !category || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    addExpense(
      {
        amount,
        description,
        groupId: selectedGroup.id,
        categoryName: category,
        receiptImage: receiptFile || undefined,
      },
      {
        onSuccess: () => {
          // Invalidate relevant queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['userExpenses'] })
          queryClient.invalidateQueries({ queryKey: ['monthlyExpenseSummary'] })
          queryClient.invalidateQueries({ queryKey: ['monthlyInsight'] })
          
          toast({
            title: "Success",
            description: "Expense added successfully",
          })
          onClose()
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to add expense",
            variant: "destructive",
          })
        },
      }
    )
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          placeholder="Enter expense description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input 
          id="amount" 
          type="number" 
          placeholder="0.00" 
          step="0.01" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="receipt">Receipt (optional)</Label>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="receipt-upload"
            className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>Upload receipt</span>
            <Input 
              id="receipt-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isPending}
            />
          </Label>
          {receiptPreview && (
            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
              <img
                src={receiptPreview || "/placeholder.svg"}
                alt="Receipt preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Expense"}
        </Button>
      </div>
    </form>
  )
}
