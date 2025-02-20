import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <div className="flex flex-col items-center mx-auto p-4 sm:max-w-md">
      <Skeleton className="h-10 w-32 mb-7" />
      <Skeleton className="h-10 w-full mb-5" />
      <Skeleton className="h-10 w-full mb-12" />
      <Skeleton className="h-10 w-72 mb-24 self-start" />
      <Skeleton className="h-20 w-80 self-start" />
    </div>
  );
}
