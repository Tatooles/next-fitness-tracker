import Image from "next/image";
import addWorkoutImage from "public/add-workout-image.png";
import duplicateWorkoutImage from "public/duplicate-workout-image.png";
import exerciseImage from "public/exercise-image.png";
import exercisesImage from "public/exercises-image.png";
import submitImage from "public/submit-image.png";
import workoutNameDateImage from "public/workout-date-name-image.png";
import workoutHistoryImage from "public/workout-history-image.png";

export default function HowTo() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Usage Guide</h1>
      <article className="mx-auto text-left sm:w-3/4 lg:w-3/5">
        <h2 className="mb-2 text-xl underline">Workouts page</h2>
        <p>
          Begin by going to the Workouts page and creating a workout by clicking
          &quot;Add a Workout&quot;
        </p>
        <Image
          src={addWorkoutImage}
          alt="Screenshot of the add workout button"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          Enter the name and date of your workout. The date will default to
          today&apos;s date.
        </p>
        <Image
          src={workoutNameDateImage}
          alt="Screenshot of the top of the create workout section"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          Now enter the exercises you performed during this workout. For each
          exercise you can enter the reps and weight for each set you performed,
          as well as notes aobut the exercise.
        </p>
        <Image
          src={exerciseImage}
          alt="Screenshot of exercise section"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <p>
          You can press &quot;Add set&quot; to create a new blank set, or
          &quot;Clone set&quot; to make a copy of the reps and sets of the last
          set in the list. Use the &quot;-&quot; button to remove a set or
          exercise.
        </p>
        <p className="mt-4">
          Once you have finished entering your workout, press submit to save
          your workout to our servers.
        </p>
        <Image
          src={submitImage}
          alt="Screeshot of submit button"
          className="my-4 h-auto w-full border-2 border-black sm:w-2/3"
        />
        <p>
          After entering your workout, it will appear under the &quot;Add
          workout&quot; button. You can see the history of all the workouts you
          have completed on the workouts page. Tap to expand a specific workout.
        </p>
        <Image
          src={workoutHistoryImage}
          alt="Screenshot of recent workouts on workouts page"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <p>
          If you have a long workout and would like to enter information as you
          go, or if you would like to update a previous workout, use the
          &quot;Edit&quot; button.
        </p>
        <p className="mt-4">
          If you are performing a workout that has similar exercises to a
          previous workout, use the &quot;Duplicate&quot; button. This will
          create a new workout with the same exercies as the orignal workout,
          but with the weight and notes fields emptied.
        </p>
        <Image
          src={duplicateWorkoutImage}
          alt="Screenshot of duplicated workout"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
        <h2 className="mb-2 text-xl underline">Exercises page</h2>
        <p>
          On the Exercises page you can see a list of all the exercises you have
          logged. Use the search bar to filter your exercises by name.
        </p>
        <Image
          src={exercisesImage}
          alt="Screenshot of exercise list filtered by name"
          className="my-4 h-auto w-full border-2 border-black sm:w-1/2"
        />
      </article>
    </div>
  );
}
