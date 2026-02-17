import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div
      className={cn("section-divider relative isolate overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="section-divider-field pointer-events-none absolute inset-0" />
      <div className="section-divider-rails pointer-events-none absolute inset-0" />

      <div className="container-portfolio relative z-10">
        <div className="section-divider-track">
          <span className="section-divider-rule" />
          {label && (
            <span className="section-divider-label">
              {label}
            </span>
          )}
          <span className="section-divider-rule" />
        </div>
      </div>
    </div>
  );
}
