import { EvaluationsHeader } from "@/components/evaluations-header"
import { EvaluationsTable } from "@/components/evaluations-table"
import { MobileHeader } from "@/components/mobile-header"

export default function EvaluationsPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileHeader />
      <EvaluationsHeader />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <EvaluationsTable />
      </div>
    </div>
  )
}
