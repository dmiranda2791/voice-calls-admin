import { CallsHeader } from "@/components/calls-header";
import { CallsTable } from "@/components/calls-table";
import { MobileHeader } from "@/components/mobile-header";

export default function CallsDefault() {
  return (
    <div className="flex flex-col h-full">
      <MobileHeader />
      <CallsHeader />
      <div className="flex-1 p-4 md:p-8 pt-6">
        <CallsTable />
      </div>
    </div>
  );
}
