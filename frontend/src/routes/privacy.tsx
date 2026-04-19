import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — FSV Capital" },
      {
        name: "description",
        content:
          "How FSV Capital collects, uses, and protects information submitted through the startup funding application.",
      },
    ],
  }),
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link to="/" className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-gold">
        ← Back
      </Link>
      <h1 className="mt-6 font-display text-4xl text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
      </p>

      <div className="prose prose-invert mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-xl text-foreground">1. Who we are</h2>
          <p className="mt-2 text-muted-foreground">
            FSV Capital ("FSV", "we") is operated by Future Transformation Pvt Ltd. We invest in
            DeepTech, Fintech, AI, Blockchain, and Growth-stage startups.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">2. What we collect</h2>
          <p className="mt-2 text-muted-foreground">
            When you submit the funding application, we collect the information you provide:
            startup and founder details, business information, traction metrics, financials,
            funding requirements, team background, and uploaded documents (pitch deck, financial
            model, demos).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">3. How we use it</h2>
          <p className="mt-2 text-muted-foreground">
            Your information is used solely to evaluate the investment opportunity, including
            sharing with FSV partners, advisors, and co-investors who may participate in the
            evaluation. We do not sell your information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">4. Storage & security</h2>
          <p className="mt-2 text-muted-foreground">
            Submissions and uploaded documents are stored on enterprise-grade infrastructure with
            encryption at rest and in transit. Access is restricted to authorised FSV personnel.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">5. Your rights (DPDP)</h2>
          <p className="mt-2 text-muted-foreground">
            Under India's Digital Personal Data Protection Act, 2023, you may request access,
            correction, or deletion of your personal data by writing to{" "}
            <a href="mailto:privacy@fsvcapital.com" className="text-gold hover:underline">
              privacy@fsvcapital.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">6. Retention</h2>
          <p className="mt-2 text-muted-foreground">
            Application data is retained for up to 24 months for pipeline tracking. After that,
            non-invested submissions are archived or deleted on request.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-foreground">7. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Questions about this policy? Email{" "}
            <a href="mailto:privacy@fsvcapital.com" className="text-gold hover:underline">
              privacy@fsvcapital.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
