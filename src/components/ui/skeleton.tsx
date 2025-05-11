// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  );
}

export { Skeleton };

// src/components/ui/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
    </div>
  );
}