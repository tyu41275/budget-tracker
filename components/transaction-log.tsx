import { Card, CardContent } from "@/components/ui/card"
import type { Transaction } from "@/components/budget-dashboard"
import { Badge } from "@/components/ui/badge"

interface TransactionLogProps {
  transactions: Transaction[]
}

export function TransactionLog({ transactions }: TransactionLogProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No transactions recorded yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {transactions.map((transaction) => {
          const date = new Date(transaction.date)
          const formattedDate = date.toLocaleDateString()
          const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

          let transactionTypeDisplay = ""
          if (transaction.type === "deduction") {
            transactionTypeDisplay = transaction.categoryType === "Utility" ? "Expense" : "Withdrawal"
          } else {
            transactionTypeDisplay = "Deposit"
          }

          let transactionColor = ""
          if (transaction.type === "deduction") {
            transactionColor = "text-red-500"
          } else {
            transactionColor = "text-green-500"
          }

          return (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      Category: {transaction.categoryName}
                      <Badge className="ml-2 text-xs">{transaction.categoryType}</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formattedDate} at {formattedTime}
                    </p>
                  </div>
                  <span className={`font-medium ${transactionColor}`}>
                    {transaction.type === "deduction" ? "-" : "+"}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
