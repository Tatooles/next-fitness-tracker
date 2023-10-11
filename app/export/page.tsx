import { Button } from "@/components/ui/button";

export default async function ExportPage() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Export Workout Data</h1>
      {/* TODO: Start with just all data, then add date bounds */}
      <Button className="bg-[#1d6f42]">Export to Excel</Button>
    </div>
  );
}
