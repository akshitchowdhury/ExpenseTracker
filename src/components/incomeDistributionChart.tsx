import { useExpenses } from "@/hooks/use-expenses"
import { PieChart as PieChartIcon } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

export function IncomeDistributionChart() {
  const { expenses, profile } = useExpenses()

  if (!profile) return null

  const monthlyIncome = profile.monthlyIncome
  const mandatorySavings = profile.mandatorySavings

  // Calculate fixed expenses
  const fixedExpensesBreakdown = [
    { name: "Rent", value: profile.fixedExpenses.rent },
    { name: "Electricity", value: profile.fixedExpenses.electricityBill },
    { name: "Furniture", value: profile.fixedExpenses.furnitureRent },
    { name: "Grocery", value: profile.fixedExpenses.grocery },
    { name: "Travel", value: profile.fixedExpenses.travel },
  ]

  const totalFixedExpenses = fixedExpensesBreakdown.reduce((sum, item) => sum + item.value, 0)
  const totalExtraExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Main distribution data
  const mainDistributionData = [
    { name: "Mandatory Savings", value: mandatorySavings, color: "#9333ea" },
    { name: "Fixed Expenses", value: totalFixedExpenses, color: "#3b82f6" },
    { name: "Extra Expenses", value: totalExtraExpenses, color: "#ef4444" },
    { 
      name: "Remaining Balance", 
      value: monthlyIncome - mandatorySavings - totalFixedExpenses - totalExtraExpenses,
      color: "#22c55e"
    },
  ].filter(item => item.value > 0)

  // Fixed expenses breakdown data with different blue shades
  const fixedExpensesData = fixedExpensesBreakdown
    .filter(item => item.value > 0)
    .map((item, index) => ({
      ...item,
      color: `hsl(217, 91%, ${65 + (index * 5)}%)`,
    }))

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">₹{data.value.toLocaleString('en-IN')}</p>
          <p className="text-sm text-muted-foreground">
            {((data.value / monthlyIncome) * 100).toFixed(1)}% of income
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon className="h-5 w-5" />
        <h3 className="font-semibold">Income Distribution</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 h-[300px]">
        <div className="relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mainDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {mainDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 w-full text-center text-sm font-medium">
            Total Income Distribution
          </div>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fixedExpensesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {fixedExpensesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 w-full text-center text-sm font-medium">
            Fixed Expenses Breakdown
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          {mainDistributionData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {fixedExpensesData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 