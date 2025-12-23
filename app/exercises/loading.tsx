import { Skeleton } from "@/components/ui/skeleton";

export default function ExercisesLoading() {
  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-8 w-full" />
      {[...Array(8)].map((_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  );
}
