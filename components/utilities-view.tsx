"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Edit2, Save, X, Trash2 } from "lucide-react"
import type { Category } from "@/components/budget-dashboard"

interface UtilitiesViewProps {
  categories: Category[]
  onDeleteCategory: (id: string) => void
  onUpdateCategory: (id: string, monthlyAmount: number) => void
}

export function UtilitiesView({ categories, onDeleteCategory, onUpdateCategory }: UtilitiesViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditValue(category.monthlyAmount.toString())
    setError(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue("")
    setError(null)
  }

  const handleSave = (id: string) => {
    const newAmount = Number(editValue)

    if (isNaN(newAmount) || newAmount <= 0) {
      setError("Amount must be a positive number")
      return
    }

    onUpdateCategory(id, newAmount)
    setEditingId(null)
    setEditValue("")
    setError(null)
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Utilities & Fixed Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No utility categories yet. Add categories like mortgage, electricity, gas, water, insurance, etc.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Utilities & Fixed Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utility</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const percentUsed = category.monthlyAmount > 0 ? (category.spent / category.monthlyAmount) * 100 : 0
              const isOverBudget = category.remaining < 0

              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {editingId === category.id ? (
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={error ? "border-red-500" : ""}
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                      </div>
                    ) : (
                      <>${category.monthlyAmount.toFixed(2)}</>
                    )}
                  </TableCell>
                  <TableCell>${category.spent.toFixed(2)}</TableCell>
                  <TableCell className={isOverBudget ? "text-red-500 font-medium" : ""}>
                    ${category.remaining.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{Math.min(100, percentUsed).toFixed(0)}%</div>
                      <Progress
                        value={Math.min(100, percentUsed)}
                        className={`h-2 ${isOverBudget ? "bg-red-200" : ""}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {editingId === category.id ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleSave(category.id)}>
                            <Save className="h-4 w-4" />
                            <span className="sr-only">Save</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
