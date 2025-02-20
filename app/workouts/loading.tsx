import { Skeleton } from "@/components/ui/skeleton";

export default function WorkoutsLoading() {
  return (
    <div className="flex flex-col items-center p-5 gap-5">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
      {[...Array(8)].map(() => (
        <Skeleton className="h-10 w-full" />
      ))}
    </div>
  );
}
