import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div
      className={cn("section-divider relative isolate overflow-hidden py-12", className)}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,15,19,0.24)_0%,rgba(14,15,19,0.72)_45%,rgba(14,15,19,0.24)_100%)]" />
        <div className="absolute left-1/2 top-1/2 h-28 w-[min(86vw,980px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(55%_100%_at_50%_50%,rgba(240,187,132,0.12),transparent_72%)] blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="container-portfolio relative z-10">
        <div className="flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          {label && (
            <span className="text-[0.58rem] uppercase tracking-[0.42em] text-pearl/68">
              {label}
            </span>
          )}
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        </div>
      </div>
    </div>
  );
}
