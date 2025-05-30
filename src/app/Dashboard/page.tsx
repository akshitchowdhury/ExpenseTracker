"use client"

import { Card } from "@/components/ui/card"
import { ExpenseForm } from "@/components/expense-form"
import { RecentTransactions } from "@/components/recent-transactions"
import PieChart from "@/components/pieChart"
import { TotalExpenseChart } from "@/components/totalExpenseChart"
import { IncomeDistributionChart } from "@/components/incomeDistributionChart"
import { DollarSign, TrendingDown, TrendingUp, CreditCard, Wallet, PiggyBank } from "lucide-react"
import { useExpenses } from "@/hooks/use-expenses"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) {
    return <LoadingSkeleton />
  }

  return <DashboardPage />
}

function DashboardPage() {
  const { expenses, profile, loading } = useExpenses()

  if (loading) {
    return <LoadingSkeleton />
  }

  const monthlyIncome = profile?.monthlyIncome || 0
  const mandatorySavings = profile?.mandatorySavings || 0

  // Fixed expenses from profile
  const fixedExpenses = profile?.fixedExpenses || {
    rent: 0,
    electricityBill: 0,
    furnitureRent: 0,
    grocery: 0,
    travel: 3500,
  }

  // Calculate totals
  const totalFixedExpenses = Object.values(fixedExpenses).reduce((sum, amount) => sum + amount, 0)
  const extraExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Calculate remaining balance
  const remainingBalance = monthlyIncome - mandatorySavings - totalFixedExpenses - extraExpenses

  return (
    <div className="space-y-8 p-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-500/10 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
              <h3 className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <PiggyBank className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mandatory Savings</p>
              <h3 className="text-2xl font-bold">{formatCurrency(mandatorySavings)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
              <h3 className="text-2xl font-bold">{formatCurrency(remainingBalance)}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/10 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold">{formatCurrency(totalFixedExpenses + extraExpenses)}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <IncomeDistributionChart />
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Extra Expense Distribution</h2>
          <div className="aspect-square">
            <PieChart />
          </div>
        </Card>
      </div>

      {/* Monthly Trend and Form Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Extra Expenses</h2>
          <div className="aspect-[2/1]">
            <TotalExpenseChart />
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Add Extra Expense</h2>
          <ExpenseForm />
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Extra Expenses</h2>
        <RecentTransactions />
      </Card>
    </div>
  )
}

