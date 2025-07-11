"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Save, X } from "lucide-react"
import type { Category } from "@/components/budget-dashboard"

interface CategoryEditViewProps {
  categories: Category[]
  onUpdateCategory: (id: string, budget: number) => void
}

export function CategoryEditView({ categories, onUpdateCategory }: CategoryEditViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditValue(category.budget.toString())
    setError(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue("")
    setError(null)
  }

  const handleSave = (id: string) => {
    const newBudget = Number(editValue)

    if (isNaN(newBudget) || newBudget <= 0) {
      setError("Budget must be a positive number")
      return
    }

    onUpdateCategory(id, newBudget)
    setEditingId(null)
    setEditValue("")
    setError(null)
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No budget categories yet. Add one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
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
                    <>${category.budget.toFixed(2)}</>
                  )}
                </TableCell>
                <TableCell>${category.spent.toFixed(2)}</TableCell>
                <TableCell className={category.remaining < 0 ? "text-red-500" : ""}>
                  ${category.remaining.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === category.id ? (
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleSave(category.id)}>
                        <Save className="h-4 w-4" />
                        <span className="sr-only">Save</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
