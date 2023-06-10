"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import WorkoutModal from "./WorkoutModal";
import Workouts from "./Workouts";
import { Workout } from "@/lib/types";
import { workouts } from "@/db/schema";

export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Index for the workout currently being edited in the edit modal
  // Currently tracking workout to edit based on index, in the future may want to go back and use an id for more precision
  const [editWorkoutIndex, setEditWorkoutIndex] = useState(-1);

  const [data, setData] = useState<typeof workouts>([]);

  useEffect(() => {
    // fetchData();
    // TODO: Create a server component to wrap this component that fetches the data and passes it down to the child
    // This page.tsx should be a server component, create a new component that has the accordion and modal state
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/workouts");
      const jsonData = await response.json();
      console.log(jsonData.workouts);
      setData(jsonData.workouts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addTestWorkout = () => {
    const workout: Workout = {
      date: "2023-04-07",
      name: "Volume Lower",
      exercises: [
        {
          name: "Sled Drag",
          sets: [],
          notes: "Gym is too busy for these, should prob use the machine.",
        },
        {
          name: "Hack Squat",
          sets: [
            {
              reps: "10",
              weight: "215",
            },
            {
              reps: "10",
              weight: "215",
            },
            {
              reps: "10",
              weight: "215",
            },
          ],
          notes:
            "1 plate pretty hard, feel like my quads need more warmup. First set pretty tough, can def feel that I'm targeting glutes which is good. This is likely because feet are pretty far forward on the pad. Second set also pretty hard. Not feeling a big pump so maybe need less weight more reps",
        },
        {
          name: "Good Morning",
          sets: [
            {
              reps: "10",
              weight: "135",
            },
            {
              reps: "10",
              weight: "145",
            },
            {
              reps: "10",
              weight: "155",
            },
          ],
          notes:
            "Going low bar beltless with normal foot width. feel pretty confident about 135. Lower back a bit sore after first set. Not sure about effect of elevated heel shoes on these. Maybe more lower back? Second set kinda the same but thinking maybe I have more hamstring rom and lower back is the limiter, which honestly is probably better.",
        },
        {
          name: "Standing Calf Raise",
          sets: [
            {
              reps: "15",
              weight: "35",
            },
            {
              reps: "15",
              weight: "35",
            },
            {
              reps: "15",
              weight: "35",
            },
          ],
          notes:
            "Gonna try 35. 4 seconds up and down for 15 first set but needed a regrip with feet, cadence pretty good. Got 15 last set too but later reps tough. Also note that shoulder placement on the pad matters",
        },
      ],
    };
    setWorkouts([workout]);
  };

  const addWorkout = () => {
    // Set variable so we know not to edit
    setEditWorkoutIndex(-1);
    setAddWorkoutModalOpen(true);
  };

  const editWorkout = (index: number) => {
    // Set value for which workout to edit
    setEditWorkoutIndex(index);
    setAddWorkoutModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Workouts workouts={workouts} editWorkout={editWorkout}></Workouts>
      <Button onClick={addWorkout}>Add a Workout</Button>
      {/* Would like to give the user the ability to enter a template, could add another button here */}
      <button
        onClick={addTestWorkout}
        className={`mt-10 rounded-md bg-yellow-300 p-1 ${
          workouts.length ? "hidden" : ""
        }`}
      >
        Add Test Workout (for debugging)
      </button>
      <WorkoutModal
        currentWorkouts={workouts}
        setWorkouts={setWorkouts}
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
        editWorkoutIndex={editWorkoutIndex}
      ></WorkoutModal>
      {data?.map((workout, index) => (
        <div key={index}>{workout.name}</div>
      ))}
    </div>
  );
}
