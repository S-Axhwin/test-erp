import { IconTrendingDown, IconTrendingUp, IconCurrencyDollar, IconShoppingCart, IconPackage, IconUsers } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample sales data (in a real app, this would come from an API)
const salesData = {
  totalRevenue: 124563.89,
  totalOrders: 1245,
  averageOrderValue: 287.34,
  newCustomers: 342,
  revenueChange: 12.5,
  ordersChange: 8.2,
  aovChange: 3.7,
  customersChange: 15.3
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconCurrencyDollar className="h-5 w-5 text-green-500" />
            <CardDescription>Total Revenue</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          ₹{salesData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant={salesData.revenueChange >= 0 ? 'outline' : 'destructive'}>
              {salesData.revenueChange >= 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
              {Math.abs(salesData.revenueChange)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {salesData.revenueChange >= 0 ? 'Increase' : 'Decrease'} from last period
            {salesData.revenueChange >= 0 ? 
              <IconTrendingUp className="size-4 text-green-500" /> : 
              <IconTrendingDown className="size-4 text-red-500" />}
          </div>
          <div className="text-muted-foreground">
            {salesData.revenueChange >= 0 ? 'Revenue is up' : 'Revenue is down'} compared to last month
          </div>
        </CardFooter>
      </Card>

      {/* Total Orders Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconShoppingCart className="h-5 w-5 text-blue-500" />
            <CardDescription>Total Orders</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {salesData.totalOrders.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={salesData.ordersChange >= 0 ? 'outline' : 'destructive'}>
              {salesData.ordersChange >= 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
              {Math.abs(salesData.ordersChange)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {salesData.ordersChange >= 0 ? 'Increase' : 'Decrease'} in orders
            {salesData.ordersChange >= 0 ? 
              <IconTrendingUp className="size-4 text-green-500" /> : 
              <IconTrendingDown className="size-4 text-red-500" />}
          </div>
          <div className="text-muted-foreground">
            {salesData.ordersChange >= 0 ? 'More' : 'Fewer'} orders than last month
          </div>
        </CardFooter>
      </Card>

      {/* Average Order Value Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconPackage className="h-5 w-5 text-purple-500" />
            <CardDescription>Avg. Order Value</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          ₹{salesData.averageOrderValue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant={salesData.aovChange >= 0 ? 'outline' : 'destructive'}>
              {salesData.aovChange >= 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
              {Math.abs(salesData.aovChange)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {salesData.aovChange >= 0 ? 'Increase' : 'Decrease'} in average order value
            {salesData.aovChange >= 0 ? 
              <IconTrendingUp className="size-4 text-green-500" /> : 
              <IconTrendingDown className="size-4 text-red-500" />}
          </div>
          <div className="text-muted-foreground">
            {salesData.aovChange >= 0 ? 'Higher' : 'Lower'} than last month
          </div>
        </CardFooter>
      </Card>

      {/* New Customers Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconUsers className="h-5 w-5 text-amber-500" />
            <CardDescription>New Vendors</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {salesData.newCustomers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant={salesData.customersChange >= 0 ? 'outline' : 'destructive'}>
              {salesData.customersChange >= 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
              {Math.abs(salesData.customersChange)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {salesData.customersChange >= 0 ? 'Growth' : 'Decline'} in new customers
            {salesData.customersChange >= 0 ? 
              <IconTrendingUp className="size-4 text-green-500" /> : 
              <IconTrendingDown className="size-4 text-red-500" />}
          </div>
          <div className="text-muted-foreground">
            {salesData.customersChange >= 0 ? 'More' : 'Fewer'} new customers than last month
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
