import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { label: string; short: string }[];
  current: number;
  onJump?: (i: number) => void;
  furthest: number;
}

export function Stepper({ steps, current, onJump, furthest }: StepperProps) {
  const pct = ((current + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          Step <span className="text-gold">{String(current + 1).padStart(2, "0")}</span> /{" "}
          {String(steps.length).padStart(2, "0")}
        </span>
        <span className="hidden sm:block font-medium text-foreground/80">{steps[current].label}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="absolute inset-y-0 left-0 gradient-gold"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-80px", "100vw"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{ left: 0 }}
        />
      </div>

      <div className="mt-4 hidden md:flex items-center justify-between gap-1">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= furthest;
          return (
            <button
              key={s.short}
              type="button"
              onClick={() => reachable && onJump?.(i)}
              disabled={!reachable}
              className="group flex flex-1 flex-col items-center gap-1.5 disabled:cursor-not-allowed"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium transition-all ${
                  active
                    ? "border-gold bg-gold text-gold-foreground pulse-gold"
                    : done
                      ? "border-gold/60 bg-gold/15 text-gold"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider truncate max-w-full ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
