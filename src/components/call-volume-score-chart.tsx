"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { getCallVolumeAndScores } from "@/app/actions/analytics"

type ChartData = {
  date: string
  calls: number
  avgScore: number | null
}

export function CallVolumeScoreChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getCallVolumeAndScores()
        // Format dates for display
        const formattedData = result.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        }))
        setData(formattedData)
      } catch (error) {
        console.error("Error fetching call volume and scores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          domain={[0, "dataMax + 10"]}
          label={{ value: "Call Volume", angle: -90, position: "insideLeft", offset: 0, fontSize: 12, fill: "#666" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 10]}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          label={{
            value: "Evaluation Score",
            angle: 90,
            position: "insideRight",
            offset: 0,
            fontSize: 12,
            fill: "#666",
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-sm">{payload[0]?.payload?.date || "N/A"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Call Volume</span>
                      <span className="font-bold text-sm">{payload[0]?.value || 0} calls</span>
                    </div>
                    {payload[1] && payload[1].value !== null && (
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Avg Score</span>
                        <span className="font-bold text-sm">{payload[1].value}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="calls"
          name="Call Volume"
          strokeWidth={2}
          stroke="hsl(var(--primary))"
          activeDot={{ r: 6, style: { fill: "hsl(var(--primary))" } }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avgScore"
          name="Avg Evaluation Score"
          strokeWidth={2}
          stroke="hsl(var(--primary) / 0.5)"
          activeDot={{ r: 6, style: { fill: "hsl(var(--primary) / 0.5)" } }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
