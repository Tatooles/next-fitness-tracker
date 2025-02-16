import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ExerciseGroupedByDate } from "@/app/api/exercises/history/route";
import Spinner from "./spinner";

export default function ExerciseHistoryModal({
  exerciseName,
}: {
  exerciseName: string;
}) {
  const [open, setOpen] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseGroupedByDate>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch(`/api/exercises/history?name=${encodeURIComponent(exerciseName)}`)
        .then((res) => res.json())
        .then((data) => {
          setExerciseHistory(data);
        })
        .finally(() => setLoading(false));
    }
  }, [open, exerciseName]);

  return (
    <div className="self-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">History</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-11/12 rounded-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{exerciseName}</DialogTitle>
          </DialogHeader>
          <div className="divide-y-2">
            {loading ? (
              <Spinner show={true}></Spinner>
            ) : (
              Object.keys(exerciseHistory).map((date) => (
                <div key={date} className="p-2 mt-4">
                  <h3 className="text-lg text-center">{date}</h3>
                  <div className="mt-4">
                    {exerciseHistory[date].sets.length > 0 && (
                      <div className="flex justify-around">
                        <div className="flex-1">Reps</div>
                        <div className="flex-1">Weight</div>
                        <div className="flex-1">RPE</div>
                      </div>
                    )}
                    {exerciseHistory[date].sets.map(
                      (set, index) =>
                        (set.reps || set.weight) && (
                          <div key={index} className="flex justify-around">
                            <div className="flex-1">{set.reps}</div>
                            <div className="flex-1">{set.weight}</div>
                            <div className="flex-1">{set.rpe}</div>
                          </div>
                        )
                    )}
                  </div>
                  {exerciseHistory[date].notes && (
                    <p className="mt-2 rounded-md dark:text-black bg-slate-300 p-2">
                      {exerciseHistory[date].notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
