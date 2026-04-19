import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  ref: z.string().optional(),
  score: z.coerce.number().optional(),
});

export const Route = createFileRoute("/thank-you")({
  validateSearch: searchSchema,
  component: ThankYou,
  head: () => ({
    meta: [
      { title: "Application Received — FSV Capital" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function ThankYou() {
  const { ref, score } = Route.useSearch();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-2xl border border-border bg-card/60 p-10 text-center backdrop-blur shadow-elegant"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 pulse-gold">
          <CheckCircle2 className="h-8 w-8 text-gold" />
        </div>
        <h1 className="font-display text-3xl text-foreground">Application received</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Thank you for applying to FSV Capital. Our investment team reviews every submission
          personally — typically within 7–10 business days.
        </p>

        {ref && (
          <div className="mt-8 rounded-lg border border-gold/30 bg-gold/5 px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Reference code
            </p>
            <p className="mt-1 font-mono text-lg text-gold">{ref}</p>
          </div>
        )}

        {typeof score === "number" && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Preliminary deal score
            </p>
            <p className="mt-1 font-display text-2xl gradient-text">{score} / 100</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Indicative only — final scoring is performed by partners.
            </p>
          </div>
        )}

        <div className="mt-8 text-left text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            What happens next
          </p>
          <ol className="space-y-2 text-foreground/90">
            <li className="flex gap-3">
              <span className="text-gold font-mono text-xs mt-0.5">01</span>
              Initial screening by FSV partners
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-mono text-xs mt-0.5">02</span>
              If shortlisted, a 30-minute intro call
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-mono text-xs mt-0.5">03</span>
              Deep-dive on team, market & traction
            </li>
            <li className="flex gap-3">
              <span className="text-gold font-mono text-xs mt-0.5">04</span>
              Term sheet discussion
            </li>
          </ol>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          Back to home <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
