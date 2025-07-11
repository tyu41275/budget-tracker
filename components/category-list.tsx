"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Category } from "@/components/budget-dashboard"

interface CategoryListProps {
  categories: Category[]
  onDeleteCategory: (id: string) => void
}

export function CategoryList({ categories, onDeleteCategory }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No budget categories yet. Add one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium">Your Budget Categories</h3>
      {categories.map((category) => {
        const percentUsed =
          category.budget > 0 ? Math.min(100, ((category.budget - category.remaining) / category.budget) * 100) : 0

        return (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{category.name}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCategory(category.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-medium">${category.budget.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Spent: </span>
                  <span className="font-medium">${category.spent.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining: </span>
                  <span className={`font-medium ${category.remaining < 0 ? "text-red-500" : ""}`}>
                    ${category.remaining.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Used: </span>
                  <span className="font-medium">{percentUsed.toFixed(0)}%</span>
                </div>
              </div>

              <Progress value={percentUsed} className={`h-2 ${category.remaining < 0 ? "bg-red-200" : ""}`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
