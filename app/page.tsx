import { BudgetDashboard } from "@/components/budget-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Budget Tracker</h1>
        <BudgetDashboard />
      </div>
    </main>
  )
}
