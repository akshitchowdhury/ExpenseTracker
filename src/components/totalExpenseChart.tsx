"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useExpenses } from "@/hooks/use-expenses"
import { formatCurrency } from "@/lib/utils"
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from "date-fns"

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-1">
        <div className="font-semibold">{data.month}</div>
        <div>{formatCurrency(data.total)}</div>
      </div>
    </div>
  )
}

export function TotalExpenseChart() {
  const { expenses } = useExpenses()

  // Get the last 6 months
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  })

  const chartData = months.map((month) => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const monthlyExpenses = expenses.filter(
      (expense) => {
        const date = new Date(expense.date)
        return date >= start && date <= end
      }
    )
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    return {
      month: format(month, "MMM"),
      total,
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--primary-foreground)", opacity: 0.1 }}
        />
        <Bar
          dataKey="total"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
