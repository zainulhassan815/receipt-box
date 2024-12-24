"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Receipt } from "../actions/receipts";

interface ExpenseChartProps {
  receipts: Receipt[];
}

export function ExpenseChart({ receipts }: ExpenseChartProps) {
  if (receipts.length == 0) return <></>;

  const chartData = receipts.reduce((acc, receipt) => {
    const category = receipt.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += receipt.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(chartData).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis
                dataKey="category"
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
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
