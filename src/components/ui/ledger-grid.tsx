import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";

interface LedgerGridProps {
  className?: string;
}

export function LedgerGrid({ className }: LedgerGridProps) {
  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      <GridPattern
        className="opacity-[var(--texture-ledger-opacity)]"
        stroke="rgba(231, 226, 217, 0.18)"
      />

      {/* Margin ticks */}
      <div className="absolute left-[4%] top-[10%] bottom-[10%] w-px bg-white/10" />
      <div className="absolute right-[4%] top-[15%] bottom-[15%] w-px bg-white/10" />

      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute left-[3.5%] h-px w-6 bg-white/15"
          style={{ top: `${12 + i * 10}%` }}
        />
      ))}
    </div>
  );
}
