import Image from "next/image";

export default function HowTo() {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Usage Guide</h1>
      <div className="text-left">
        <p>
          Begin by going to the Workouts page and creating a workout by clicking
          "Add a Workout"
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
          today's date.
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
          You can press "Add set" to create a new blank set, or "Clone set" to
          make a copy of the reps and sets of the last set in the list. Use the
          "-" button to remove a set or exercise.
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
          After entering your workout, it will appear under the "Add workout"
          button. You can see the history of all the workouts you have completed
          on the workouts page. Tap to expand a specific workout.
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
          go, or if you would like to update a previous workout, use the "Edit"
          button.
        </p>
        <p className="mt-4">
          If you are performing a workout that has similar exercises to a
          previous workout, use the "Duplicate" button. This will create a new
          workout with the same exercies as the orignal workout, but with the
          weight and notes fields emptied.
        </p>
        <Image
          src="/duplicate-workout-image.png"
          alt=""
          width={300}
          height={300}
          className="my-4 border-2 border-black"
        />
      </div>
    </div>
  );
}
