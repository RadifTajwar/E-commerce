
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis } from "recharts"

const data = [
    { date: "Jan", current: 35, average: 40 },
    { date: "Feb", current: 28, average: 38 },
    { date: "Mar", current: 90, average: 35 },
    { date: "Apr", current: 45, average: 37 },
    { date: "May", current: 50, average: 35 },
    { date: "Jun", current: 45, average: 38 },
    { date: "Jul", current: 48, average: 42 },
]

export default function weeklySales() {
    return (
        <Card className="w-full max-w-3xl">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Exercise Minutes</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Your exercise minutes are ahead of where you normally are.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        current: {
                            label: "Current",
                            color: "hsl(var(--foreground))",
                        },
                        average: {
                            label: "Average",
                            color: "hsl(var(--muted-foreground))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />
                        <Line
                            type="monotone"
                            dataKey="current"
                            stroke="var(--color-current)"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "hsl(var(--background))",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                strokeWidth: 3,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="average"
                            stroke="var(--color-average)"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "hsl(var(--background))",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                strokeWidth: 3,
                            }}
                        />
                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Current
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {payload[0].value}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Average
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {payload[1].value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
