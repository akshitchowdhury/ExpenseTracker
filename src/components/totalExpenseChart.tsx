"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useExpenses } from "@/hooks/use-expenses"
import { formatCurrency } from "@/lib/utils"
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from "date-fns"

// Define the shape of your chart data.
interface ChartData {
  month: string
  total: number
}

// Define the type for a tooltip item. Typically Recharts passes an array of items,
// each with a `payload` property that contains your ChartData.
interface CustomTooltipItem {
  payload: ChartData
  // Additional properties like `name` or `value` can be added as needed.
}

// Define props for the CustomTooltip component.
interface CustomTooltipProps {
  active?: boolean
  payload?: CustomTooltipItem[]
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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

  const chartData: ChartData[] = months.map((month) => {
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const monthlyExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date)
      return date >= start && date <= end
    })
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
