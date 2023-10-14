import { Button } from "@/components/ui/button";

export default async function ExportPage() {
  const getFile = async () => {
    console.log("getting file");
    await fetch(`/api/export`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          console.log("response returned");
        } else {
          console.error("Failed to fetch workout data.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching workout data:", error);
      });
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Export Workout Data</h1>
      {/* TODO: Start with just all data, then add date bounds */}
      <Button onClick={getFile} className="bg-[#1d6f42]">
        Export to Excel
      </Button>
    </div>
  );
}
