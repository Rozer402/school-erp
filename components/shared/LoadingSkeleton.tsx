import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
export default function LoadingSkeleton({ className, count = 3 }: { className?: string; count?: number }) {
  return (
    <div className={cn("space-y-4 w-full", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-6 bg-white dark:bg-card rounded-3xl border border-border/50 shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl bg-muted/50" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px] bg-muted/50" />
              <Skeleton className="h-4 w-[200px] bg-muted/50" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full bg-muted/30" />
            <Skeleton className="h-4 w-[90%] bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
