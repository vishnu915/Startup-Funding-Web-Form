import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ApplicationForm } from "@/components/application/ApplicationForm";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "FSV Capital — Startup Funding Application" },
      {
        name: "description",
        content:
          "Apply for funding from FSV Capital. We back DeepTech, Fintech, AI, Blockchain, and Growth-stage startups shaping the future.",
      },
      { property: "og:title", content: "FSV Capital — Startup Funding Application" },
      {
        property: "og:description",
        content: "Fueling DeepTech, Fintech & Future Innovation. Submit your application in 8–12 minutes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <Toaster theme="dark" position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-border/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-gold text-gold-foreground font-display text-sm font-bold">
              F
            </div>
            <div>
              <p className="font-display text-base leading-none tracking-tight text-foreground">
                FSV Capital
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Future Transformation
              </p>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#thesis" className="hover:text-foreground transition-colors">Thesis</a>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-gold"
          >
            Capital Application · 2026 Cohort
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl leading-[1.05] text-foreground"
          >
            Capital for the founders <br className="hidden sm:block" />
            building <span className="gradient-text">tomorrow's infrastructure</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed"
          >
            Fueling DeepTech, Fintech & Future Innovation. Submit your application in 8–12 minutes.
            We review every submission personally.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground"
          >
            <span>· DeepTech</span>
            <span>· Fintech</span>
            <span>· AI / ML</span>
            <span>· Blockchain</span>
            <span>· SaaS · Growth</span>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <main className="px-6 py-12 sm:py-20">
        <ApplicationForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Future Transformation Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <a href="mailto:partners@fsvcapital.com" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
