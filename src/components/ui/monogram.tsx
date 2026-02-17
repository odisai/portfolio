import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
}

export function Monogram({ className }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-10 w-10 text-copper", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <path
        d="M38 78V36h44v8H46v34h-8z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <path
        d="M78 84V52H62v-8h24v40h-8z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
      />
    </svg>
  );
}
