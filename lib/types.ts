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
}

export interface Set {
  reps: string;
  weight: string;
}
