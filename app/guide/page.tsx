import Image from "next/image";

export default function HowTo() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Usage Guide</h1>
      <article className="text-left">
        <h2 className="mb-2 text-xl underline">Workouts page</h2>
        <p>
          Begin by going to the Workouts page and creating a workout by clicking
          &quot;Add a Workout&quot;
        </p>
        <Image
          src="/add-workout-image.png"
          alt="Screenshot of add workout button"
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
        <p>
          Enter the name and date of your workout. The date will default to
          today&apos;s date.
        </p>
        <Image
          src="/workout-date-name-image.png"
          alt="Screenshot of top of workout section"
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
        <p>
          Now enter the exercises you performed during this workout. For each
          exercise you can enter the reps and weight for each set you performed,
          as well as notes aobut the exercise.
        </p>
        <Image
          src="/exercise-image.png"
          alt="Screenshot of exercise section"
          width={300}
          height={300}
          className="my-4 border-2 border-black"
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
          src="/submit-image.png"
          alt=""
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
        <p>
          After entering your workout, it will appear under the &quot;Add
          workout&quot; button. You can see the history of all the workouts you
          have completed on the workouts page. Tap to expand a specific workout.
        </p>
        <Image
          src="/workout-history-image.png"
          alt=""
          width={300}
          height={300}
          className="my-4 border-2 border-black"
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
          src="/duplicate-workout-image.png"
          alt=""
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
        <h2 className="mb-2 text-xl underline">Exercises page</h2>
        <p>
          One the Exercises page you can see a list of all the exercises you
          have logged. Use the search bar to filter your exercises by name.
        </p>
        <Image
          src="/exercises-image.png"
          alt=""
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
      </article>
    </div>
  );
}
