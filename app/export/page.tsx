import Link from "next/link";

export default async function ExportPage() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Export Workout Data</h1>
      <div className="flex flex-col items-center">
        <Link
          href="api/export?fileType=xlsx"
          className="mt-2 w-40 rounded-md bg-[#1d6f42] p-3 text-white"
        >
          Export to Excel
        </Link>
        <Link
          href="api/export?fileType=csv"
          className="mt-2 w-40 rounded-md bg-yellow-400 p-3 text-white"
        >
          Export to CSV
        </Link>
      </div>
    </div>
  );
}
