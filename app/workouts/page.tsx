"use client";
import { useState } from "react";
import AddWorkoutModal from "./AddWorkoutModal";
import Workouts from "./Workouts";

export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addTestWorkout = () => {
    const workout = {
      date: "2023-04-07",
      name: "Volume Lower",
      exercises: [
        {
          name: "Sled Drag",
          sets: [],
          reps: "",
          notes:
            "Gym too packed for this shit smh, should prob use the machine.",
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
          reps: "",
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
          reps: "",
          notes:
            "Going low bar beltless with normal foot width. feel pretty confident about 135 . 135 very solid. Lower back a bit sore after first set. Not sure about effect of elevated heel shoes on these. Maybe more lower back? Second set kinda the same but thinking maybe I have more hamstring rom and lower back is the limiter, which honestly is probably better. Gonna send 155",
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
          reps: "",
          notes:
            "Gonna try 35. 4s up and down for 15 first set but needed a regrip with feet, cadence pretty good. Sale pause second set, later reps also definitely slower. Got 15 last set too but same thing as the ones before. Also note that shoulder placement on the pad matters",
        },
      ],
    };
    setWorkouts([workout]);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Workouts workouts={workouts}></Workouts>
      <button
        onClick={() => setAddWorkoutModalOpen(true)}
        className="rounded-md bg-slate-700 p-2 text-white"
      >
        Add a Workout
      </button>
      <button
        onClick={addTestWorkout}
        className={`mt-10 rounded-md bg-yellow-300 p-1 ${
          workouts.length ? "hidden" : ""
        }`}
      >
        Add Test Workout (for debugging)
      </button>
      <AddWorkoutModal
        currentWorkouts={workouts}
        setWorkouts={setWorkouts}
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
      ></AddWorkoutModal>
    </div>
  );
}

export interface Workout {
  date: string;
  name: string;
  exercises: Exercise[];
}

// Reps and sets are strings because they can be a range
export interface Exercise {
  sets: Set[];
  name: string;
  notes: string;
  reps: string;
}

export interface Set {
  reps: string;
  weight: string;
}
