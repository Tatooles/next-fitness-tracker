import Image from "next/image";

export default function HowTo() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Usage Guide</h1>
      <article className="mx-auto text-left sm:w-3/4 lg:w-3/5">
        <h2 className="mb-2 text-xl underline">Workouts Page</h2>
        <p>
          Navigate to the Workouts page and create a workout by clicking
          &quot;Add Workout.&quot;
        </p>
        <Image
          src="/add-workout-image.png"
          width={500}
          height={500}
          alt="Screenshot of the Add Workout button"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          Enter the name and date of the workout. The date will default to
          today&apos;s date.
        </p>
        <Image
          src="/workout-date-name-image.png"
          width={500}
          height={500}
          alt="Screenshot of the top of the create workout section"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          Enter the exercises performed during this workout. For each exercise
          enter the reps and weight for each set performed, as well as notes
          about the exercise.
        </p>
        <Image
          src="/exercise-image.png"
          width={500}
          height={500}
          alt="Screenshot of exercise section"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <p>
          Press &quot;Add set&quot; to create a new blank set, or &quot;Clone
          set&quot; to make a copy of the reps and weight of the last set in the
          list. Use the &quot;-&quot; button to remove a set or exercise.
        </p>
        <p className="mt-4">
          Once a workout has been entered, press submit to save the workout to
          the Lifting Log.
        </p>
        <Image
          src="/submit-image.png"
          width={500}
          height={500}
          alt="Screeshot of submit button"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          After entering a workout, it will be visible under the &quot;Add
          Workout&quot; button. The history of all the workouts completed is
          visible on the workouts page. Tap to expand a specific workout.
        </p>
        <Image
          src="/workout-history-image.png"
          width={500}
          height={500}
          alt="Screenshot of recent workouts on workouts page"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <p>
          For long workouts where entering information as you go is a benefit,
          or to update a previous workout, use the &quot;Edit&quot; button.
        </p>
        <p className="mt-4">
          When performing a workout that has similar exercises to a previous
          workout, use the &quot;Duplicate&quot; button. This creates a new
          workout with the same exercises as the original workout with the
          weight and notes fields emptied.
        </p>
        <Image
          src="/duplicate-workout-image.png"
          width={500}
          height={500}
          alt="Screenshot of duplicated workout"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <h2 className="mb-2 text-xl underline">Exercises Page</h2>
        <p>
          On the Exercises page view a list of all the exercises logged. Use the
          search bar to filter exercises by name.
        </p>
        <Image
          src="/exercises-image.png"
          width={500}
          height={500}
          alt="Screenshot of exercise list filtered by name"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
      </article>
    </div>
  );
}
