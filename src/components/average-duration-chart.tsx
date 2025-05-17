"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { getAverageCallDuration } from "@/app/actions/analytics";

type ChartData = {
  name: string;
  inboundDuration: number;
  outboundDuration: number;
};

export function AverageDurationChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAverageCallDuration();
        setData(
          Array.isArray(result)
            ? result.map((item) => ({
                ...item,
                name: String(item.name),
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching average call duration:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          label={{
            value: "Minutes",
            angle: -90,
            position: "insideLeft",
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
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Company
                      </span>
                      <span className="font-bold text-sm">
                        {payload[0]?.payload?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Inbound Calls
                      </span>
                      <span className="font-bold text-sm">
                        {payload[0]?.value || 0} min
                      </span>
                    </div>
                    {payload[1] && (
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Outbound Calls
                        </span>
                        <span className="font-bold text-sm">
                          {payload[1]?.value || 0} min
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar
          dataKey="inboundDuration"
          name="Inbound Calls"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="outboundDuration"
          name="Outbound Calls"
          fill="hsl(var(--primary) / 0.5)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
