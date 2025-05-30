"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

// Extend if needed to support themes
export type ChartConfig = Record<
  string,
  {
    label: string
    color?: string
    icon?: React.ElementType
    theme?: {
      light?: string
      dark?: string
    }
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const chartId = React.useId()

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn("h-full w-full", className)}
        data-chart={chartId}
        style={
          {
            "--chart-1": "215 25% 27%",
            "--chart-2": "142 72% 29%",
            "--chart-3": "198 93% 60%",
            "--chart-4": "158 64% 52%",
            "--chart-5": "316 72% 52%",
            "--chart-6": "24 85% 52%",
            "--chart-7": "267 83% 60%",
            "--chart-8": "338 85% 52%",
            "--color-desktop": "hsl(var(--chart-1))",
            "--color-mobile": "hsl(var(--chart-2))",
            "--color-label": "hsl(var(--chart-3))",
            "--color-chrome": "hsl(var(--chart-1))",
            "--color-safari": "hsl(var(--chart-2))",
            "--color-firefox": "hsl(var(--chart-3))",
            "--color-edge": "hsl(var(--chart-4))",
            "--color-other": "hsl(var(--chart-5))",
          } as React.CSSProperties
        }
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
        <ChartStyle id={chartId} config={config} />
      </div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipContentProps {
  nameKey?: string
  hideLabel?: boolean
  indicator?: "line" | "bar"
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, any>
  }>
}

function ChartTooltipContent({
  active,
  payload,
  nameKey,
  hideLabel,
  indicator = "bar",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {!hideLabel && (
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {nameKey}
            </span>
            <span className="font-bold">
              {payload[0]?.payload[nameKey || "name"]}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Value
          </span>
          <span className="font-bold">{payload[0]?.value}</span>
        </div>
      </div>
    </div>
  )
}

function ChartTooltip({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-2 shadow-sm",
        "data-[visible=false]:hidden"
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  )
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const styles = colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                  itemConfig.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .filter(Boolean)
              .join("\n")
            return styles
              ? `${prefix} [data-chart="${id}"] {\n${styles}\n}`
              : ""
          })
          .join("\n"),
      }}
    />
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = nameKey || (item.dataKey as string) || "value"
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract config for legend tooltip
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
) {
  const rawPayload = payload?.payload || {}
  const possibleKey = rawPayload[key] || payload[key] || key
  return config[possibleKey] || config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
}
