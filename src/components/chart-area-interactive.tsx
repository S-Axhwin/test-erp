"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive sales chart"

// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 83.5

const chartData = [
  { date: "2024-04-01", online: Math.round(12500 * USD_TO_INR_RATE), retail: Math.round(8750 * USD_TO_INR_RATE) },
  { date: "2024-04-02", online: Math.round(9200 * USD_TO_INR_RATE), retail: Math.round(11400 * USD_TO_INR_RATE) },
  { date: "2024-04-03", online: Math.round(15800 * USD_TO_INR_RATE), retail: Math.round(9600 * USD_TO_INR_RATE) },
  { date: "2024-04-04", online: Math.round(18900 * USD_TO_INR_RATE), retail: Math.round(16250 * USD_TO_INR_RATE) },
  { date: "2024-04-05", online: Math.round(22300 * USD_TO_INR_RATE), retail: Math.round(19500 * USD_TO_INR_RATE) },
  { date: "2024-04-06", online: Math.round(19800 * USD_TO_INR_RATE), retail: Math.round(22100 * USD_TO_INR_RATE) },
  { date: "2024-04-07", online: Math.round(16750 * USD_TO_INR_RATE), retail: Math.round(12300 * USD_TO_INR_RATE) },
  { date: "2024-04-08", online: Math.round(24500 * USD_TO_INR_RATE), retail: Math.round(18900 * USD_TO_INR_RATE) },
  { date: "2024-04-09", online: Math.round(8950 * USD_TO_INR_RATE), retail: Math.round(7200 * USD_TO_INR_RATE) },
  { date: "2024-04-10", online: Math.round(17300 * USD_TO_INR_RATE), retail: Math.round(13800 * USD_TO_INR_RATE) },
  { date: "2024-04-11", online: Math.round(21200 * USD_TO_INR_RATE), retail: Math.round(24500 * USD_TO_INR_RATE) },
  { date: "2024-04-12", online: Math.round(18600 * USD_TO_INR_RATE), retail: Math.round(15750 * USD_TO_INR_RATE) },
  { date: "2024-04-13", online: Math.round(23100 * USD_TO_INR_RATE), retail: Math.round(26200 * USD_TO_INR_RATE) },
  { date: "2024-04-14", online: Math.round(12750 * USD_TO_INR_RATE), retail: Math.round(16800 * USD_TO_INR_RATE) },
  { date: "2024-04-15", online: Math.round(11200 * USD_TO_INR_RATE), retail: Math.round(13500 * USD_TO_INR_RATE) },
  { date: "2024-04-16", online: Math.round(13600 * USD_TO_INR_RATE), retail: Math.round(14900 * USD_TO_INR_RATE) },
  { date: "2024-04-17", online: Math.round(28900 * USD_TO_INR_RATE), retail: Math.round(25200 * USD_TO_INR_RATE) },
  { date: "2024-04-18", online: Math.round(25300 * USD_TO_INR_RATE), retail: Math.round(29800 * USD_TO_INR_RATE) },
  { date: "2024-04-19", online: Math.round(18200 * USD_TO_INR_RATE), retail: Math.round(13900 * USD_TO_INR_RATE) },
  { date: "2024-04-20", online: Math.round(9750 * USD_TO_INR_RATE), retail: Math.round(11250 * USD_TO_INR_RATE) },
  { date: "2024-04-21", online: Math.round(13500 * USD_TO_INR_RATE), retail: Math.round(15600 * USD_TO_INR_RATE) },
  { date: "2024-04-22", online: Math.round(16800 * USD_TO_INR_RATE), retail: Math.round(13200 * USD_TO_INR_RATE) },
  { date: "2024-04-23", online: Math.round(13900 * USD_TO_INR_RATE), retail: Math.round(17800 * USD_TO_INR_RATE) },
  { date: "2024-04-24", online: Math.round(26400 * USD_TO_INR_RATE), retail: Math.round(21900 * USD_TO_INR_RATE) },
  { date: "2024-04-25", online: Math.round(17500 * USD_TO_INR_RATE), retail: Math.round(19200 * USD_TO_INR_RATE) },
  { date: "2024-04-26", online: Math.round(8200 * USD_TO_INR_RATE), retail: Math.round(10500 * USD_TO_INR_RATE) },
  { date: "2024-04-27", online: Math.round(25800 * USD_TO_INR_RATE), retail: Math.round(31200 * USD_TO_INR_RATE) },
  { date: "2024-04-28", online: Math.round(12300 * USD_TO_INR_RATE), retail: Math.round(14600 * USD_TO_INR_RATE) },
  { date: "2024-04-29", online: Math.round(21900 * USD_TO_INR_RATE), retail: Math.round(18750 * USD_TO_INR_RATE) },
  { date: "2024-04-30", online: Math.round(32100 * USD_TO_INR_RATE), retail: Math.round(28900 * USD_TO_INR_RATE) },
  { date: "2024-05-01", online: Math.round(14500 * USD_TO_INR_RATE), retail: Math.round(17200 * USD_TO_INR_RATE) },
  { date: "2024-05-02", online: Math.round(20300 * USD_TO_INR_RATE), retail: Math.round(24100 * USD_TO_INR_RATE) },
  { date: "2024-05-03", online: Math.round(18200 * USD_TO_INR_RATE), retail: Math.round(14800 * USD_TO_INR_RATE) },
  { date: "2024-05-04", online: Math.round(26800 * USD_TO_INR_RATE), retail: Math.round(31500 * USD_TO_INR_RATE) },
  { date: "2024-05-05", online: Math.round(35200 * USD_TO_INR_RATE), retail: Math.round(29800 * USD_TO_INR_RATE) },
  { date: "2024-05-06", online: Math.round(37500 * USD_TO_INR_RATE), retail: Math.round(42300 * USD_TO_INR_RATE) },
  { date: "2024-05-07", online: Math.round(27900 * USD_TO_INR_RATE), retail: Math.round(22500 * USD_TO_INR_RATE) },
  { date: "2024-05-08", online: Math.round(13400 * USD_TO_INR_RATE), retail: Math.round(16800 * USD_TO_INR_RATE) },
  { date: "2024-05-09", online: Math.round(16500 * USD_TO_INR_RATE), retail: Math.round(14200 * USD_TO_INR_RATE) },
  { date: "2024-05-10", online: Math.round(20800 * USD_TO_INR_RATE), retail: Math.round(25900 * USD_TO_INR_RATE) },
  { date: "2024-05-11", online: Math.round(24200 * USD_TO_INR_RATE), retail: Math.round(20500 * USD_TO_INR_RATE) },
  { date: "2024-05-12", online: Math.round(15800 * USD_TO_INR_RATE), retail: Math.round(18900 * USD_TO_INR_RATE) },
  { date: "2024-05-13", online: Math.round(15900 * USD_TO_INR_RATE), retail: Math.round(12800 * USD_TO_INR_RATE) },
  { date: "2024-05-14", online: Math.round(31800 * USD_TO_INR_RATE), retail: Math.round(38200 * USD_TO_INR_RATE) },
  { date: "2024-05-15", online: Math.round(34500 * USD_TO_INR_RATE), retail: Math.round(29200 * USD_TO_INR_RATE) },
  { date: "2024-05-16", online: Math.round(24100 * USD_TO_INR_RATE), retail: Math.round(31200 * USD_TO_INR_RATE) },
  { date: "2024-05-17", online: Math.round(36800 * USD_TO_INR_RATE), retail: Math.round(32500 * USD_TO_INR_RATE) },
  { date: "2024-05-18", online: Math.round(22900 * USD_TO_INR_RATE), retail: Math.round(26800 * USD_TO_INR_RATE) },
  { date: "2024-05-19", online: Math.round(17200 * USD_TO_INR_RATE), retail: Math.round(14200 * USD_TO_INR_RATE) },
  { date: "2024-05-20", online: Math.round(14500 * USD_TO_INR_RATE), retail: Math.round(18500 * USD_TO_INR_RATE) },
  { date: "2024-05-21", online: Math.round(9200 * USD_TO_INR_RATE), retail: Math.round(11500 * USD_TO_INR_RATE) },
  { date: "2024-05-22", online: Math.round(8950 * USD_TO_INR_RATE), retail: Math.round(9800 * USD_TO_INR_RATE) },
  { date: "2024-05-23", online: Math.round(18600 * USD_TO_INR_RATE), retail: Math.round(22900 * USD_TO_INR_RATE) },
  { date: "2024-05-24", online: Math.round(21200 * USD_TO_INR_RATE), retail: Math.round(17800 * USD_TO_INR_RATE) },
  { date: "2024-05-25", online: Math.round(15900 * USD_TO_INR_RATE), retail: Math.round(19500 * USD_TO_INR_RATE) },
  { date: "2024-05-26", online: Math.round(16100 * USD_TO_INR_RATE), retail: Math.round(13200 * USD_TO_INR_RATE) },
  { date: "2024-05-27", online: Math.round(29800 * USD_TO_INR_RATE), retail: Math.round(35200 * USD_TO_INR_RATE) },
  { date: "2024-05-28", online: Math.round(17800 * USD_TO_INR_RATE), retail: Math.round(14900 * USD_TO_INR_RATE) },
  { date: "2024-05-29", online: Math.round(8750 * USD_TO_INR_RATE), retail: Math.round(10200 * USD_TO_INR_RATE) },
  { date: "2024-05-30", online: Math.round(24500 * USD_TO_INR_RATE), retail: Math.round(21800 * USD_TO_INR_RATE) },
  { date: "2024-05-31", online: Math.round(14200 * USD_TO_INR_RATE), retail: Math.round(18500 * USD_TO_INR_RATE) },
  { date: "2024-06-01", online: Math.round(14800 * USD_TO_INR_RATE), retail: Math.round(16200 * USD_TO_INR_RATE) },
  { date: "2024-06-02", online: Math.round(33200 * USD_TO_INR_RATE), retail: Math.round(31800 * USD_TO_INR_RATE) },
  { date: "2024-06-03", online: Math.round(11200 * USD_TO_INR_RATE), retail: Math.round(12900 * USD_TO_INR_RATE) },
  { date: "2024-06-04", online: Math.round(31500 * USD_TO_INR_RATE), retail: Math.round(29200 * USD_TO_INR_RATE) },
  { date: "2024-06-05", online: Math.round(9800 * USD_TO_INR_RATE), retail: Math.round(11200 * USD_TO_INR_RATE) },
  { date: "2024-06-06", online: Math.round(21200 * USD_TO_INR_RATE), retail: Math.round(19500 * USD_TO_INR_RATE) },
  { date: "2024-06-07", online: Math.round(23100 * USD_TO_INR_RATE), retail: Math.round(28900 * USD_TO_INR_RATE) },
  { date: "2024-06-08", online: Math.round(27800 * USD_TO_INR_RATE), retail: Math.round(24500 * USD_TO_INR_RATE) },
  { date: "2024-06-09", online: Math.round(31200 * USD_TO_INR_RATE), retail: Math.round(37500 * USD_TO_INR_RATE) },
  { date: "2024-06-10", online: Math.round(13800 * USD_TO_INR_RATE), retail: Math.round(16200 * USD_TO_INR_RATE) },
  { date: "2024-06-11", online: Math.round(10200 * USD_TO_INR_RATE), retail: Math.round(12500 * USD_TO_INR_RATE) },
  { date: "2024-06-12", online: Math.round(35800 * USD_TO_INR_RATE), retail: Math.round(32500 * USD_TO_INR_RATE) },
  { date: "2024-06-13", online: Math.round(9200 * USD_TO_INR_RATE), retail: Math.round(10800 * USD_TO_INR_RATE) },
  { date: "2024-06-14", online: Math.round(30800 * USD_TO_INR_RATE), retail: Math.round(29500 * USD_TO_INR_RATE) },
  { date: "2024-06-15", online: Math.round(22500 * USD_TO_INR_RATE), retail: Math.round(27200 * USD_TO_INR_RATE) },
  { date: "2024-06-16", online: Math.round(26900 * USD_TO_INR_RATE), retail: Math.round(24100 * USD_TO_INR_RATE) },
  { date: "2024-06-17", online: Math.round(34200 * USD_TO_INR_RATE), retail: Math.round(40500 * USD_TO_INR_RATE) },
  { date: "2024-06-18", online: Math.round(11800 * USD_TO_INR_RATE), retail: Math.round(13900 * USD_TO_INR_RATE) },
  { date: "2024-06-19", online: Math.round(24800 * USD_TO_INR_RATE), retail: Math.round(22500 * USD_TO_INR_RATE) },
  { date: "2024-06-20", online: Math.round(29500 * USD_TO_INR_RATE), retail: Math.round(35200 * USD_TO_INR_RATE) },
  { date: "2024-06-21", online: Math.round(14200 * USD_TO_INR_RATE), retail: Math.round(16800 * USD_TO_INR_RATE) },
  { date: "2024-06-22", online: Math.round(23200 * USD_TO_INR_RATE), retail: Math.round(21200 * USD_TO_INR_RATE) },
  { date: "2024-06-23", online: Math.round(34800 * USD_TO_INR_RATE), retail: Math.round(41200 * USD_TO_INR_RATE) },
  { date: "2024-06-24", online: Math.round(12900 * USD_TO_INR_RATE), retail: Math.round(14500 * USD_TO_INR_RATE) },
  { date: "2024-06-25", online: Math.round(13500 * USD_TO_INR_RATE), retail: Math.round(15200 * USD_TO_INR_RATE) },
  { date: "2024-06-26", online: Math.round(31200 * USD_TO_INR_RATE), retail: Math.round(29500 * USD_TO_INR_RATE) },
  { date: "2024-06-27", online: Math.round(32500 * USD_TO_INR_RATE), retail: Math.round(38200 * USD_TO_INR_RATE) },
  { date: "2024-06-28", online: Math.round(13200 * USD_TO_INR_RATE), retail: Math.round(16500 * USD_TO_INR_RATE) },
]
const chartConfig = {
  sales: {
    label: "Sales",
  },
  online: {
    label: "Online Sales",
    color: "var(--primary)",
  },
  retail: {
    label: "Retail Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const totalSales = filteredData.reduce((sum, item) => sum + item.online + item.retail, 0)

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Sales Revenue</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Revenue breakdown for the last 3 months - ₹{totalSales.toLocaleString()}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months - ₹{totalSales.toLocaleString()}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOnline" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-online)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-online)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRetail" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-retail)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-retail)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, ""]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="retail"
              type="natural"
              fill="url(#fillRetail)"
              stroke="var(--color-retail)"
              stackId="a"
            />
            <Area
              dataKey="online"
              type="natural"
              fill="url(#fillOnline)"
              stroke="var(--color-online)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
