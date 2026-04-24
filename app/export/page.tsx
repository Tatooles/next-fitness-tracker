import Link from "next/link";
import { Download } from "lucide-react";

export default async function ExportPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-5 py-6 sm:px-8">
      <div>
        <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
          Data
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Export Workout Data
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Download your training history for spreadsheets, backups, or external
          analysis.
        </p>
      </div>
      <div className="grid gap-3">
        <Link
          href="api/export?fileType=xlsx"
          className="border-border/80 bg-card hover:border-primary/50 hover:bg-accent flex items-center justify-between rounded-lg border p-4 font-semibold transition-colors"
        >
          <span>Export to Excel</span>
          <Download className="text-primary size-4" />
        </Link>
        <Link
          href="api/export?fileType=csv"
          className="border-border/80 bg-card hover:border-primary/50 hover:bg-accent flex items-center justify-between rounded-lg border p-4 font-semibold transition-colors"
        >
          <span>Export to CSV</span>
          <Download className="text-primary size-4" />
        </Link>
      </div>
    </div>
  );
}
