"use client"

import { LabelList, Pie, PieChart, Tooltip, TooltipProps } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useExpenses } from "@/hooks/use-expenses"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
  Rent: {
    label: "Rent",
    color: "hsl(var(--chart-1))",
  },
  Electricity: {
    label: "Electricity",
    color: "hsl(var(--chart-2))",
  },
  Furniture: {
    label: "Furniture",
    color: "hsl(var(--chart-3))",
  },
  Savings: {
    label: "Savings",
    color: "hsl(var(--chart-4))",
  },
  "House Deposit": {
    label: "House Deposit",
    color: "hsl(var(--chart-5))",
  },
  Grocery: {
    label: "Grocery",
    color: "hsl(var(--chart-6))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

interface ExpenseData {
  category: string;
  amount: number;
  fill: string;
}

const CustomTooltip = ({ 
  active, 
  payload 
}: TooltipProps<number, string> & { 
  payload?: Array<{ 
    payload: ExpenseData 
  }> 
}) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-1">
        <div className="font-semibold">{data.category}</div>
        <div>{formatCurrency(data.amount)}</div>
      </div>
    </div>
  )
}

const PieChart_Component = () => {
  const { expenses } = useExpenses()

  const chartData = Object.entries(
    expenses.reduce((acc, expense) => {
      const category = expense.category
      acc[category] = (acc[category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)
  ).map(([category, amount]) => ({
    category,
    amount,
    fill: chartConfig[category as keyof typeof chartConfig]?.color || "hsl(var(--chart-7))",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>By Category</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius="40%"
                outerRadius="80%"
                paddingAngle={2}
              >
                <LabelList
                  dataKey="category"
                  position="outside"
                  className="fill-foreground"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PieChart_Component