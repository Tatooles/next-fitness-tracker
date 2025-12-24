import { Spinner } from "@/components/ui/spinner";

export function LoadingOverlay({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-start justify-center pt-[33vh] backdrop-blur-sm">
      <Spinner className="size-8" />
    </div>
  );
}
