import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, required, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      <div className="field-glow rounded-md">{children}</div>
      {hint && !error && <p className="text-[11px] text-muted-foreground/80">{hint}</p>}
      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

export const fieldInputClasses =
  "w-full rounded-md border border-input bg-secondary/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-gold/60 focus:bg-secondary/60 focus:outline-none";

export const fieldTextareaClasses = `${fieldInputClasses} min-h-[96px] resize-y leading-relaxed`;
