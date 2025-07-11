"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, Transaction } from "@/components/budget-dashboard"

interface TransactionFormProps {
  categories: Category[]
  onAddTransaction: (transaction: Omit<Transaction, "id" | "date" | "categoryName" | "categoryType">) => void
}

export function TransactionForm({ categories, onAddTransaction }: TransactionFormProps) {
  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"expense" | "deposit" | "withdrawal">("expense")
  const [error, setError] = useState("")

  const selectedCategory = categories.find((c) => c.id === categoryId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryId) {
      setError("Please select a category")
      return
    }

    const transactionAmount = Number.parseFloat(amount)
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Amount must be a positive number")
      return
    }

    onAddTransaction({
      categoryId,
      amount: transactionAmount,
      description: description.trim() || getDefaultDescription(),
      type,
    })

    // Reset form
    setAmount("")
    setDescription("")
    setError("")
  }

  const getDefaultDescription = () => {
    if (!selectedCategory) return "Transaction"

    if (selectedCategory.type === "utility") {
      return type === "expense" ? `${selectedCategory.name} bill` : `${selectedCategory.name} refund`
    } else {
      return type === "deposit"
        ? `Contribution to ${selectedCategory.name}`
        : `Withdrawal from ${selectedCategory.name}`
    }
  }

  const getTransactionOptions = () => {
    if (!selectedCategory) return []

    if (selectedCategory.type === "utility") {
      return [
        { value: "expense", label: "Record Expense", description: "Money spent on this utility" },
        { value: "deposit", label: "Add Refund/Credit", description: "Money returned or credited" },
      ]
    } else {
      return [
        { value: "deposit", label: "Add Money", description: "Contribute to this savings goal" },
        { value: "withdrawal", label: "Withdraw Money", description: "Use money from this fund" },
      ]
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            You need to create at least one category before recording transactions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transaction-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="transaction-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  Utilities
                </SelectItem>
                {categories
                  .filter((c) => c.type === "utility")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} (${category.remaining.toFixed(2)} remaining)
                    </SelectItem>
                  ))}
                <SelectItem value="" disabled>
                  Budget Goals
                </SelectItem>
                {categories
                  .filter((c) => c.type === "budget")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} (${category.saved.toFixed(2)} saved)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "expense" | "deposit" | "withdrawal")}
                className="space-y-2"
              >
                {getTransactionOptions().map((option) => (
                  <div key={option.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor={option.value} className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="transaction-amount">Amount</Label>
            <Input
              id="transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-description">Description (Optional)</Label>
            <Input
              id="transaction-description"
              placeholder={selectedCategory ? getDefaultDescription() : "Transaction description"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={!selectedCategory}>
            Record Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
