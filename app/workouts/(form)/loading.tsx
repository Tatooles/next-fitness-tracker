import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <div className="mx-auto flex flex-col items-center p-4 sm:max-w-md">
      <Skeleton className="mb-7 h-10 w-32" />
      <Skeleton className="mb-5 h-10 w-full" />
      <Skeleton className="mb-12 h-10 w-full" />
      <Skeleton className="mb-24 h-10 w-72 self-start" />
      <Skeleton className="h-20 w-80 self-start" />
    </div>
  );
}
