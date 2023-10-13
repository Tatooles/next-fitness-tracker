"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function ExportPage() {
  const [showSpinner, setShowSpinner] = useState(false);

  const getFile = async () => {
    setShowSpinner(true);
    console.log("getting file");
    // await fetch(`/api/workouts/${workout}`, {
    //   method: "DELETE",
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       console.log("response returned");
    //     } else {
    //       console.error("Failed to delete exercise.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("An error occurred while deleting exercise:", error);
    //   });
    setShowSpinner(false);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Export Workout Data</h1>
      {/* TODO: Start with just all data, then add date bounds */}
      <Button onClick={getFile} className="bg-[#1d6f42]">
        Export to Excel
      </Button>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
