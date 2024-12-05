"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { ArrowUpRight } from "lucide-react"
import { Pie, PieChart } from "recharts"

const data = [
  { name: "Section 1", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Section 2", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Section 3", value: 200, fill: "hsl(var(--chart-3))" },
  { name: "Section 4", value: 225, fill: "hsl(var(--chart-4))" },
]

export default function Component() {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <ChartContainer
            config={{
              section1: {
                label: "Section 1",
                color: "hsl(var(--chart-1))",
              },
              section2: {
                label: "Section 2",
                color: "hsl(var(--chart-2))",
              },
              section3: {
                label: "Section 3",
                color: "hsl(var(--chart-3))",
              },
              section4: {
                label: "Section 4",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="flex justify-center [&>svg]:max-h-[300px]"
          >
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-3xl font-bold">{total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Visitors</div>
            </div>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].value} visitors
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            Trending up by 5.2% this month
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing total visitors for the last 6 months
          </p>
        </div>
      </CardContent>
    </Card>
  )
}