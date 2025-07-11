"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category, CategoryType } from "@/components/budget-dashboard"

interface CategoryFormProps {
  onAddCategory: (category: Omit<Category, "id" | "spent" | "saved" | "remaining">) => void
}

export function CategoryForm({ onAddCategory }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<CategoryType>("utility")
  const [monthlyAmount, setMonthlyAmount] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    const amount = Number.parseFloat(monthlyAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number")
      return
    }

    onAddCategory({
      name: name.trim(),
      type,
      monthlyAmount: amount,
    })

    // Reset form
    setName("")
    setMonthlyAmount("")
    setError("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-type">Category Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as CategoryType)}>
              <SelectTrigger id="category-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utility">Utility/Fixed Expense</SelectItem>
                <SelectItem value="budget">Budget/Savings Goal</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {type === "utility"
                ? "Fixed monthly expenses like mortgage, electricity, insurance"
                : "Savings goals like vacation fund, house renovation, emergency fund"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder={
                type === "utility"
                  ? "e.g., Mortgage, Electricity, Car Insurance"
                  : "e.g., Vacation Fund, House Renovation, Emergency Fund"
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-amount">
              {type === "utility" ? "Monthly Budget Amount" : "Monthly Contribution"}
            </Label>
            <Input
              id="monthly-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {type === "utility"
                ? "How much you budget for this expense each month"
                : "How much you plan to save toward this goal each month"}
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full">
            Add {type === "utility" ? "Utility" : "Budget"} Category
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
