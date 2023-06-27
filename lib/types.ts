export interface Workout {
  id: number;
  name: string;
  userId: string | null;
  date: Date;
  exercises: Exercise[];
}

// Reps and sets are strings because they can be a range
export interface Exercise {
  id: number;
  name: string;
  notes: string;
  workoutId: number;
  sets: Set[];
}

export interface Set {
  id: number;
  reps: string;
  weight: string;
  exerciseId: number;
}
