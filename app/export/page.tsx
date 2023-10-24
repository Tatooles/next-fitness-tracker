import Link from "next/link";

export default async function ExportPage() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Export Workout Data</h1>
      {/* TODO: Start with just all data, then add date bounds */}
      <Link
        href="api/export"
        className="mt-2 rounded-md bg-[#1d6f42] p-3 text-white"
      >
        Export to Excel
      </Link>
    </div>
  );
}
