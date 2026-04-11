import { ReactNode } from "react";
import { Ghost, Search, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: "search" | "inbox" | "alert" | "ghost" | ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

const iconMap = {
  search: Search,
  inbox: Inbox,
  alert: AlertCircle,
  ghost: Ghost,
};

export function EmptyState({ icon = "ghost", title, description, action, className }: EmptyStateProps) {
  const isStringIcon = typeof icon === "string" && icon in iconMap;
  const Icon = isStringIcon ? iconMap[icon as keyof typeof iconMap] : null;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-card border border-border/50 rounded-3xl space-y-6 shadow-sm",
      className
    )}>
      <div className="p-6 bg-muted/20 dark:bg-muted/10 rounded-full animate-pulse border border-border/10">
        {Icon ? (
          <Icon className="w-12 h-12 text-muted-foreground/30" />
        ) : (
          <div className="w-12 h-12 text-muted-foreground/30 flex items-center justify-center">
            {icon as ReactNode}
          </div>
        )}
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-black text-foreground tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium">{description}</p>
      </div>
      {action && (
        <Button 
          onClick={action.onClick}
          className="rounded-2xl px-8 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
