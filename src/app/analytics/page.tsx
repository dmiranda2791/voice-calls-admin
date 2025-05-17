import { AnalyticsHeader } from "@/components/analytics-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CallVolumeScoreChart } from "@/components/call-volume-score-chart"
import { AverageDurationChart } from "@/components/average-duration-chart"
import { SeedDatabaseButton } from "@/components/seed-database-button"
import { MobileHeader } from "@/components/mobile-header"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileHeader />
      <AnalyticsHeader />
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex justify-end">
          <SeedDatabaseButton />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Call Volumes & Evaluation Scores</CardTitle>
              <CardDescription>Trends over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CallVolumeScoreChart />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Average Call Duration</CardTitle>
              <CardDescription>By agent type and company</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AverageDurationChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
