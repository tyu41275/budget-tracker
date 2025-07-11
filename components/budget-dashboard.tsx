"use client"

import { useEffect, useState } from "react"
import { CategoryForm } from "@/components/category-form"
import { UtilitiesView } from "@/components/utilities-view"
import { BudgetsView } from "@/components/budgets-view"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionLog } from "@/components/transaction-log"
import { ExpenseSummary } from "@/components/expense-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export type CategoryType = "utility" | "budget"

export type Category = {
  id: string
  name: string
  type: CategoryType
  monthlyAmount: number // For utilities: monthly budget, For budgets: monthly contribution
  spent: number // For utilities: actual expenses, For budgets: money withdrawn
  saved: number // For budgets: money accumulated, For utilities: unused budget
  remaining: number // Calculated field
}

export type Transaction = {
  id: string
  categoryId: string
  categoryName: string
  categoryType: CategoryType
  amount: number
  description: string
  date: string
  type: "expense" | "deposit" | "withdrawal"
}

export function BudgetDashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCategories = localStorage.getItem("monthlyExpenseCategories")
    const savedTransactions = localStorage.getItem("monthlyExpenseTransactions")

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("monthlyExpenseCategories", JSON.stringify(categories))
    localStorage.setItem("monthlyExpenseTransactions", JSON.stringify(transactions))
  }, [categories, transactions])

  const addCategory = (category: Omit<Category, "id" | "spent" | "saved" | "remaining">) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: category.name,
      type: category.type,
      monthlyAmount: category.monthlyAmount,
      spent: 0,
      saved: category.type === "budget" ? 0 : category.monthlyAmount, // Budgets start at 0, utilities start with full amount
      remaining: category.type === "budget" ? 0 : category.monthlyAmount,
    }

    setCategories([...categories, newCategory])
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
    setTransactions(transactions.filter((transaction) => transaction.categoryId !== id))
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "date" | "categoryName" | "categoryType">) => {
    const category = categories.find((c) => c.id === transaction.categoryId)
    if (!category) return

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      categoryId: transaction.categoryId,
      categoryName: category.name,
      categoryType: category.type,
      amount: transaction.amount,
      description: transaction.description,
      date: new Date().toISOString(),
      type: transaction.type,
    }

    // Update category based on transaction type and category type
    const updatedCategories = categories.map((c) => {
      if (c.id === transaction.categoryId) {
        let newSpent = c.spent
        let newSaved = c.saved
        let newRemaining = c.remaining

        if (c.type === "utility") {
          // For utilities: expenses reduce remaining budget
          if (transaction.type === "expense") {
            newSpent = c.spent + transaction.amount
            newRemaining = c.monthlyAmount - newSpent
          } else if (transaction.type === "deposit") {
            // Adding money back to utility budget
            newSpent = Math.max(0, c.spent - transaction.amount)
            newRemaining = c.monthlyAmount - newSpent
          }
        } else {
          // For budgets: deposits increase saved amount, withdrawals decrease it
          if (transaction.type === "deposit") {
            newSaved = c.saved + transaction.amount
            newRemaining = newSaved
          } else if (transaction.type === "withdrawal") {
            newSaved = Math.max(0, c.saved - transaction.amount)
            newRemaining = newSaved
          }
        }

        return {
          ...c,
          spent: newSpent,
          saved: newSaved,
          remaining: newRemaining,
        }
      }
      return c
    })

    setTransactions([newTransaction, ...transactions])
    setCategories(updatedCategories)
  }

  const updateCategory = (id: string, newMonthlyAmount: number) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === id) {
        let newRemaining: number
        if (category.type === "utility") {
          newRemaining = newMonthlyAmount - category.spent
        } else {
          newRemaining = category.saved // For budgets, remaining is just the saved amount
        }

        return {
          ...category,
          monthlyAmount: newMonthlyAmount,
          remaining: newRemaining,
        }
      }
      return category
    })

    setCategories(updatedCategories)

    // Add a transaction to log this change
    const category = categories.find((c) => c.id === id)
    if (category) {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        categoryId: id,
        categoryName: category.name,
        categoryType: category.type,
        amount: Math.abs(newMonthlyAmount - category.monthlyAmount),
        description: `${category.type === "utility" ? "Budget" : "Monthly contribution"} ${
          newMonthlyAmount > category.monthlyAmount ? "increased" : "decreased"
        } from $${category.monthlyAmount.toFixed(2)} to $${newMonthlyAmount.toFixed(2)}`,
        date: new Date().toISOString(),
        type: "deposit",
      }
      setTransactions([newTransaction, ...transactions])
    }
  }

  const utilities = categories.filter((c) => c.type === "utility")
  const budgets = categories.filter((c) => c.type === "budget")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs defaultValue="utilities">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="add">Add Category</TabsTrigger>
            <TabsTrigger value="transactions">Record Transaction</TabsTrigger>
            <TabsTrigger value="log">Transaction Log</TabsTrigger>
          </TabsList>
          <TabsContent value="utilities">
            <Card className="p-4">
              <UtilitiesView
                categories={utilities}
                onDeleteCategory={deleteCategory}
                onUpdateCategory={updateCategory}
              />
            </Card>
          </TabsContent>
          <TabsContent value="budgets">
            <Card className="p-4">
              <BudgetsView categories={budgets} onDeleteCategory={deleteCategory} onUpdateCategory={updateCategory} />
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card className="p-4">
              <CategoryForm onAddCategory={addCategory} />
            </Card>
          </TabsContent>
          <TabsContent value="transactions">
            <Card className="p-4">
              <TransactionForm categories={categories} onAddTransaction={addTransaction} />
            </Card>
          </TabsContent>
          <TabsContent value="log">
            <Card className="p-4">
              <TransactionLog transactions={transactions} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <ExpenseSummary utilities={utilities} budgets={budgets} />
      </div>
    </div>
  )
}
