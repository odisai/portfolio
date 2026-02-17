import { cn } from "@/lib/utils";

interface EdgeCardProps {
  children: React.ReactNode;
  className?: string;
}

export function EdgeCard({ children, className }: EdgeCardProps) {
  return (
    <div
      className={cn(
        "edge-cut copper-trace surface-card backdrop-blur-md",
        "relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--color-copper)]/10 blur-[60px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
