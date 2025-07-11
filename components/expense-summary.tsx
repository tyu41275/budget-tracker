import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Category } from "@/components/budget-dashboard"

interface ExpenseSummaryProps {
  utilities: Category[]
  budgets: Category[]
}

export function ExpenseSummary({ utilities, budgets }: ExpenseSummaryProps) {
  const totalUtilityBudget = utilities.reduce((sum, category) => sum + category.monthlyAmount, 0)
  const totalUtilitySpent = utilities.reduce((sum, category) => sum + category.spent, 0)
  const totalUtilityRemaining = utilities.reduce((sum, category) => sum + category.remaining, 0)

  const totalBudgetContributions = budgets.reduce((sum, category) => sum + category.monthlyAmount, 0)
  const totalBudgetSaved = budgets.reduce((sum, category) => sum + category.saved, 0)

  const utilityChartData = utilities.map((category) => ({
    name: category.name,
    budget: category.monthlyAmount,
    spent: category.spent,
  }))

  const budgetChartData = budgets.map((category) => ({
    name: category.name,
    target: category.monthlyAmount,
    saved: category.saved,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">UTILITIES & FIXED EXPENSES</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-xl font-bold">${totalUtilityBudget.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-xl font-bold">${totalUtilitySpent.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-xl font-bold ${totalUtilityRemaining < 0 ? "text-red-500" : "text-green-600"}`}>
                    ${totalUtilityRemaining.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="text-xl font-bold">
                    {totalUtilityBudget > 0 ? ((totalUtilitySpent / totalUtilityBudget) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">SAVINGS & BUDGET GOALS</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Monthly Target</p>
                  <p className="text-xl font-bold">${totalBudgetContributions.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-xl font-bold text-green-600">${totalBudgetSaved.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {utilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Utility Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilityChartData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`]} />
                  <Bar dataKey="budget" fill="#e2e8f0" name="Budget" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {budgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="saved"
                    nameKey="name"
                  >
                    {budgetChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
