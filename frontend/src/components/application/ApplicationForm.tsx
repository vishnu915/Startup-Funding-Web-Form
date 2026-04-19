import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/application/Stepper";
import { Field, fieldInputClasses, fieldTextareaClasses } from "@/components/application/Field";

import {
  fullApplicationSchema,
  stepSchemas,
  INDUSTRIES,
  BUSINESS_MODELS,
  FUNDING_STAGES,
  USE_OF_FUNDS_OPTIONS,
} from "@/lib/application-schema";
import type { ApplicationData } from "@/lib/application-schema";
import { computeDealScore } from "@/lib/scoring";

const STEPS = [
  { label: "Basic Information", short: "Basic", key: "basic" },
  { label: "Startup Overview", short: "Overview", key: "overview" },
  { label: "Product & Technology", short: "Product", key: "product" },
  { label: "Market Opportunity", short: "Market", key: "market" },
  { label: "Traction & Metrics", short: "Traction", key: "traction" },
  { label: "Financials", short: "Financials", key: "financials" },
  { label: "Funding Requirement", short: "Funding", key: "funding" },
  { label: "Team", short: "Team", key: "team" },
  { label: "Strategic Fit with FSV Capital", short: "Fit", key: "strategic" },
  { label: "Documents Upload", short: "Docs", key: "documents" },
  { label: "Compliance & Declaration", short: "Compliance", key: "compliance" },
  { label: "Review & Submit", short: "Review", key: "review" },
] as const;

const DRAFT_KEY = "fsv_application_draft_v1";

type FormState = Partial<Record<keyof ApplicationData, unknown>> & {
  use_of_funds_selected?: string[];
};

interface UploadedFile {
  path: string;
  name: string;
  size: number;
}

interface DocsState {
  pitch_deck?: UploadedFile;
  financial_model?: UploadedFile;
  product_demo?: UploadedFile;
  additional?: UploadedFile[];
}

export function ApplicationForm() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [furthest, setFurthest] = React.useState(0);
  const [data, setData] = React.useState<FormState>({
    open_to_mentorship: true,
    company_registered: true,
    legal_issues: false,
    consent_given: false,
    currency: "USD",
    use_of_funds_selected: [],
  });
  const [docs, setDocs] = React.useState<DocsState>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [resumePromptDismissed, setResumePromptDismissed] = React.useState(false);
  const [hasDraft, setHasDraft] = React.useState(false);

  // Load draft on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data && Object.keys(parsed.data).length > 4) {
          setHasDraft(true);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Auto-save
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step, savedAt: Date.now() }));
      } catch {
        /* ignore quota */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [data, step]);

  const restoreDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed.data ?? {});
        setStep(parsed.step ?? 0);
        setFurthest(parsed.step ?? 0);
        toast.success("Draft restored");
      }
    } catch {
      toast.error("Could not restore draft");
    }
    setResumePromptDismissed(true);
    setHasDraft(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setResumePromptDismissed(true);
    setHasDraft(false);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const { [key as string]: _, ...rest } = e;
      return rest;
    });
  };

  const validateStep = (): boolean => {
    const stepKey = STEPS[step].key;
    if (stepKey === "review") return true;
    if (stepKey === "documents") {
      if (!docs.pitch_deck) {
        setErrors({ pitch_deck: "Pitch deck is required (PDF)" });
        return false;
      }
      setErrors({});
      return true;
    }
    const schema = stepSchemas[stepKey as keyof typeof stepSchemas];
    if (!schema) return true;

    // Build payload with use_of_funds joined for funding step
    const payload: Record<string, unknown> = { ...data };
    if (stepKey === "funding") {
      payload.use_of_funds = (data.use_of_funds_selected ?? []).join(", ");
    }
    const result = schema.safeParse(payload);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errs[path]) errs[path] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return false;
    }
    if (stepKey === "funding") {
      update("use_of_funds", payload.use_of_funds as string);
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    const ns = Math.min(STEPS.length - 1, step + 1);
    setStep(ns);
    setFurthest((f) => Math.max(f, ns));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prev = () => {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFile = async (
  file: File,
  slot: keyof Omit<DocsState, "additional"> | "additional",
  opts?: { pdfOnly?: boolean; maxMb?: number },
) => {
  const maxMb = opts?.maxMb ?? 25;

  // ✅ size validation
  if (file.size > maxMb * 1024 * 1024) {
    toast.error(`File too large (max ${maxMb} MB)`);
    return;
  }

  // ✅ pdf validation
  if (opts?.pdfOnly && file.type !== "application/pdf") {
    toast.error("Pitch deck must be a PDF");
    return;
  }

  try {
    // ✅ send file to backend (Node + MySQL)
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Upload failed");
      return;
    }

    // ✅ store response
    const uploaded: UploadedFile = {
      path: result.path,
      name: file.name,
      size: file.size,
    };

    // ✅ update state
    if (slot === "additional") {
      setDocs((d) => ({
        ...d,
        additional: [...(d.additional ?? []), uploaded],
      }));
    } else {
      setDocs((d) => ({
        ...d,
        [slot]: uploaded,
      }));
    }

    // ✅ remove error if pitch deck uploaded
    if (slot === "pitch_deck") {
      setErrors((e) => {
        const { pitch_deck: _, ...rest } = e;
        return rest;
      });
    }

    toast.success(`${file.name} uploaded`);
  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  }
};

  const removeFile = (slot: keyof Omit<DocsState, "additional"> | { additional: number }) => {
    if (typeof slot === "object") {
      setDocs((d) => ({
        ...d,
        additional: (d.additional ?? []).filter((_, i) => i !== slot.additional),
      }));
    } else {
      setDocs((d) => ({ ...d, [slot]: undefined }));
    }
  };

  const handleSubmit = async () => {
  setSubmitting(true);

  try {
    const payload = {
      ...data,
      use_of_funds: (data.use_of_funds_selected ?? []).join(", "),
      pitch_deck_path: docs.pitch_deck?.path || null,
      financial_model_path: docs.financial_model?.path || null,
      product_demo_path: docs.product_demo?.path || null,
      additional_docs_paths: JSON.stringify(docs.additional || [])
    };

    console.log("Sending payload:", payload); // ✅ DEBUG

    const res = await fetch("http://localhost:5000/api/application", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // ✅ SAFE JSON PARSE (VERY IMPORTANT)
    let result;
    try {
      result = await res.json();
    } catch (err) {
      const text = await res.text();
      console.error("Invalid JSON from server:", text);
      throw new Error("Server returned invalid response");
    }

    // ❌ If backend error
    if (!res.ok) {
      throw new Error(result?.message || "Submission failed");
    }

    // ✅ SUCCESS
    console.log("Success:", result);
    toast.success("Application submitted successfully ✅");

  } catch (err: any) {
    console.error("SUBMIT ERROR:", err);
    toast.error(err.message || "Submission failed ❌");
  } finally {
    setSubmitting(false);
  }
};

  const livePreviewScore = React.useMemo(
    () => computeDealScore({ ...data, use_of_funds: (data.use_of_funds_selected ?? []).join(", ") } as Partial<ApplicationData>),
    [data],
  );

  const stepKey = STEPS[step].key;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {hasDraft && !resumePromptDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3"
        >
          <p className="text-sm">
            <span className="text-gold font-medium">Draft found.</span>{" "}
            <span className="text-muted-foreground">Resume your previous application?</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={discardDraft}>
              Start fresh
            </Button>
            <Button size="sm" onClick={restoreDraft} className="bg-gold text-gold-foreground hover:bg-gold/90">
              Resume
            </Button>
          </div>
        </motion.div>
      )}

      <Stepper
        steps={STEPS.map((s) => ({ label: s.label, short: s.short }))}
        current={step}
        furthest={furthest}
        onJump={(i) => {
          setStep(i);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur shadow-elegant">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">{STEPS[step].label}</h2>
              <div className="mt-1 h-px w-12 gradient-gold" />

              <div className="mt-7 space-y-5">
                {stepKey === "basic" && <BasicSection data={data} update={update} errors={errors} />}
                {stepKey === "overview" && <OverviewSection data={data} update={update} errors={errors} />}
                {stepKey === "product" && <ProductSection data={data} update={update} errors={errors} />}
                {stepKey === "market" && <MarketSection data={data} update={update} errors={errors} />}
                {stepKey === "traction" && <TractionSection data={data} update={update} errors={errors} />}
                {stepKey === "financials" && <FinancialsSection data={data} update={update} errors={errors} />}
                {stepKey === "funding" && <FundingSection data={data} update={update} errors={errors} />}
                {stepKey === "team" && <TeamSection data={data} update={update} errors={errors} />}
                {stepKey === "strategic" && <StrategicSection data={data} update={update} errors={errors} />}
                {stepKey === "documents" && (
                  <DocumentsSection
                    docs={docs}
                    onUpload={uploadFile}
                    onRemove={removeFile}
                    error={errors.pitch_deck}
                  />
                )}
                {stepKey === "compliance" && <ComplianceSection data={data} update={update} errors={errors} />}
                {stepKey === "review" && (
                  <ReviewSection data={data} docs={docs} score={livePreviewScore} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={prev}
              disabled={step === 0 || submitting}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            <div className="flex items-center gap-3">
              <p className="hidden sm:block text-[11px] uppercase tracking-wider text-muted-foreground">
                Auto-saved locally
              </p>
              {step < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-glow"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !data.consent_given}
                  className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-glow"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Section components ---------------- */

type SectionProps = {
  data: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  errors: Record<string, string>;
};

function BasicSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Startup Name" required error={errors.startup_name} className="sm:col-span-2">
        <input
          className={fieldInputClasses}
          value={(data.startup_name as string) ?? ""}
          onChange={(e) => update("startup_name", e.target.value)}
          placeholder="e.g. Helix Labs"
        />
      </Field>
      <Field label="Website URL" error={errors.website_url}>
        <input
          className={fieldInputClasses}
          value={(data.website_url as string) ?? ""}
          onChange={(e) => update("website_url", e.target.value)}
          placeholder="https://..."
        />
      </Field>
      <Field label="Year of Incorporation" error={errors.year_incorporation as string}>
        <input
          type="number"
          className={fieldInputClasses}
          value={(data.year_incorporation as number | string) ?? ""}
          onChange={(e) => update("year_incorporation", e.target.value)}
          placeholder="2024"
        />
      </Field>
      <Field label="Founder Name(s)" required error={errors.founder_names} className="sm:col-span-2">
        <input
          className={fieldInputClasses}
          value={(data.founder_names as string) ?? ""}
          onChange={(e) => update("founder_names", e.target.value)}
          placeholder="Jane Doe, John Smith"
        />
      </Field>
      <Field label="Contact Email" required error={errors.contact_email}>
        <input
          type="email"
          className={fieldInputClasses}
          value={(data.contact_email as string) ?? ""}
          onChange={(e) => update("contact_email", e.target.value)}
          placeholder="founder@startup.com"
        />
      </Field>
      <Field label="Contact Number" error={errors.contact_number}>
        <input
          className={fieldInputClasses}
          value={(data.contact_number as string) ?? ""}
          onChange={(e) => update("contact_number", e.target.value)}
          placeholder="+1 555 0100"
        />
      </Field>
      <Field label="Founder LinkedIn" error={errors.founder_linkedin}>
        <input
          className={fieldInputClasses}
          value={(data.founder_linkedin as string) ?? ""}
          onChange={(e) => update("founder_linkedin", e.target.value)}
          placeholder="linkedin.com/in/..."
        />
      </Field>
      <Field label="Company LinkedIn" error={errors.company_linkedin}>
        <input
          className={fieldInputClasses}
          value={(data.company_linkedin as string) ?? ""}
          onChange={(e) => update("company_linkedin", e.target.value)}
          placeholder="linkedin.com/company/..."
        />
      </Field>
      <Field label="HQ City" error={errors.hq_city}>
        <input
          className={fieldInputClasses}
          value={(data.hq_city as string) ?? ""}
          onChange={(e) => update("hq_city", e.target.value)}
          placeholder="Bangalore"
        />
      </Field>
      <Field label="HQ Country" error={errors.hq_country}>
        <input
          className={fieldInputClasses}
          value={(data.hq_country as string) ?? ""}
          onChange={(e) => update("hq_country", e.target.value)}
          placeholder="India"
        />
      </Field>
    </div>
  );
}

function OverviewSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <Field label="Problem Statement" required error={errors.problem_statement} hint="What problem are you solving?">
        <textarea
          className={fieldTextareaClasses}
          value={(data.problem_statement as string) ?? ""}
          onChange={(e) => update("problem_statement", e.target.value)}
        />
      </Field>
      <Field label="Solution Overview" required error={errors.solution_overview}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.solution_overview as string) ?? ""}
          onChange={(e) => update("solution_overview", e.target.value)}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Industry / Sector" required error={errors.industry}>
          <select
            className={fieldInputClasses}
            value={(data.industry as string) ?? ""}
            onChange={(e) => update("industry", e.target.value)}
          >
            <option value="">Select industry…</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Business Model" required error={errors.business_model}>
          <select
            className={fieldInputClasses}
            value={(data.business_model as string) ?? ""}
            onChange={(e) => update("business_model", e.target.value)}
          >
            <option value="">Select model…</option>
            {BUSINESS_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Current Stage" required error={errors.current_stage}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(["Idea", "MVP", "Early Revenue", "Growth Stage", "Scaling"] as const).map((s) => {
            const active = data.current_stage === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => update("current_stage", s)}
                className={`rounded-md border px-3 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? "border-gold bg-gold/10 text-gold shadow-glow"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-gold/40 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function ProductSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <Field label="Core Product Description" required error={errors.core_product}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.core_product as string) ?? ""}
          onChange={(e) => update("core_product", e.target.value)}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Technology Stack" required error={errors.tech_stack} hint="AI, Blockchain, Cloud, APIs…">
          <input
            className={fieldInputClasses}
            value={(data.tech_stack as string) ?? ""}
            onChange={(e) => update("tech_stack", e.target.value)}
          />
        </Field>
        <Field label="IP / Patents" error={errors.ip_patents}>
          <input
            className={fieldInputClasses}
            value={(data.ip_patents as string) ?? ""}
            onChange={(e) => update("ip_patents", e.target.value)}
            placeholder="2 pending patents"
          />
        </Field>
      </div>
      <Field label="Unique Value Proposition (USP)" required error={errors.usp}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.usp as string) ?? ""}
          onChange={(e) => update("usp", e.target.value)}
        />
      </Field>
      <Field label="Demo Link / Product Video" error={errors.demo_link}>
        <input
          className={fieldInputClasses}
          value={(data.demo_link as string) ?? ""}
          onChange={(e) => update("demo_link", e.target.value)}
          placeholder="https://..."
        />
      </Field>
    </div>
  );
}

function MarketSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="TAM" required error={errors.tam} hint="Total addressable market">
          <input
            className={fieldInputClasses}
            value={(data.tam as string) ?? ""}
            onChange={(e) => update("tam", e.target.value)}
            placeholder="$120B"
          />
        </Field>
        <Field label="SAM" error={errors.sam}>
          <input
            className={fieldInputClasses}
            value={(data.sam as string) ?? ""}
            onChange={(e) => update("sam", e.target.value)}
            placeholder="$25B"
          />
        </Field>
        <Field label="SOM" error={errors.som}>
          <input
            className={fieldInputClasses}
            value={(data.som as string) ?? ""}
            onChange={(e) => update("som", e.target.value)}
            placeholder="$1.2B"
          />
        </Field>
      </div>
      <Field label="Customer Segment" required error={errors.customer_segment}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.customer_segment as string) ?? ""}
          onChange={(e) => update("customer_segment", e.target.value)}
        />
      </Field>
      <Field label="Key Competitors" error={errors.competitors}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.competitors as string) ?? ""}
          onChange={(e) => update("competitors", e.target.value)}
        />
      </Field>
      <Field label="Your Competitive Advantage" required error={errors.competitive_advantage}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.competitive_advantage as string) ?? ""}
          onChange={(e) => update("competitive_advantage", e.target.value)}
        />
      </Field>
    </div>
  );
}

function TractionSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Monthly Revenue" error={errors.monthly_revenue}>
        <input
          className={fieldInputClasses}
          value={(data.monthly_revenue as string) ?? ""}
          onChange={(e) => update("monthly_revenue", e.target.value)}
          placeholder="$25k"
        />
      </Field>
      <Field label="Annual Revenue" error={errors.annual_revenue}>
        <input
          className={fieldInputClasses}
          value={(data.annual_revenue as string) ?? ""}
          onChange={(e) => update("annual_revenue", e.target.value)}
          placeholder="$300k ARR"
        />
      </Field>
      <Field label="Growth Rate (%)" error={errors.growth_rate}>
        <input
          className={fieldInputClasses}
          value={(data.growth_rate as string) ?? ""}
          onChange={(e) => update("growth_rate", e.target.value)}
          placeholder="22% MoM"
        />
      </Field>
      <Field label="Customers / Users" error={errors.customer_count}>
        <input
          className={fieldInputClasses}
          value={(data.customer_count as string) ?? ""}
          onChange={(e) => update("customer_count", e.target.value)}
          placeholder="1,200 paid"
        />
      </Field>
      <Field label="Key Partnerships" error={errors.partnerships} className="sm:col-span-2">
        <textarea
          className={fieldTextareaClasses}
          value={(data.partnerships as string) ?? ""}
          onChange={(e) => update("partnerships", e.target.value)}
        />
      </Field>
      <Field label="Notable Achievements / Awards" error={errors.achievements} className="sm:col-span-2">
        <textarea
          className={fieldTextareaClasses}
          value={(data.achievements as string) ?? ""}
          onChange={(e) => update("achievements", e.target.value)}
        />
      </Field>
    </div>
  );
}

function FinancialsSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Funding Raised To Date" error={errors.funding_raised}>
        <input
          className={fieldInputClasses}
          value={(data.funding_raised as string) ?? ""}
          onChange={(e) => update("funding_raised", e.target.value)}
          placeholder="$1.2M"
        />
      </Field>
      <Field label="Existing Investors" error={errors.existing_investors}>
        <input
          className={fieldInputClasses}
          value={(data.existing_investors as string) ?? ""}
          onChange={(e) => update("existing_investors", e.target.value)}
          placeholder="Sequoia Surge, angels"
        />
      </Field>
      <Field label="Burn Rate" error={errors.burn_rate}>
        <input
          className={fieldInputClasses}
          value={(data.burn_rate as string) ?? ""}
          onChange={(e) => update("burn_rate", e.target.value)}
          placeholder="$60k / month"
        />
      </Field>
      <Field label="Runway (months)" error={errors.runway_months}>
        <input
          className={fieldInputClasses}
          value={(data.runway_months as string) ?? ""}
          onChange={(e) => update("runway_months", e.target.value)}
          placeholder="14"
        />
      </Field>
      <Field label="Revenue Projections (next 3 years)" error={errors.revenue_projections} className="sm:col-span-2">
        <textarea
          className={fieldTextareaClasses}
          value={(data.revenue_projections as string) ?? ""}
          onChange={(e) => update("revenue_projections", e.target.value)}
          placeholder="Y1: $1M · Y2: $4M · Y3: $12M"
        />
      </Field>
    </div>
  );
}

function FundingSection({ data, update, errors }: SectionProps) {
  const selected = (data.use_of_funds_selected as string[]) ?? [];
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
    update("use_of_funds_selected", next);
  };
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Amount Raising" required error={errors.amount_raising} className="sm:col-span-2">
          <input
            className={fieldInputClasses}
            value={(data.amount_raising as string) ?? ""}
            onChange={(e) => update("amount_raising", e.target.value)}
            placeholder="2,500,000"
          />
        </Field>
        <Field label="Currency" required error={errors.currency}>
          <select
            className={fieldInputClasses}
            value={(data.currency as string) ?? "USD"}
            onChange={(e) => update("currency", e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Funding Stage" required error={errors.funding_stage}>
          <select
            className={fieldInputClasses}
            value={(data.funding_stage as string) ?? ""}
            onChange={(e) => update("funding_stage", e.target.value)}
          >
            <option value="">Select stage…</option>
            {FUNDING_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Equity Offered (%)" error={errors.equity_offered}>
          <input
            className={fieldInputClasses}
            value={(data.equity_offered as string) ?? ""}
            onChange={(e) => update("equity_offered", e.target.value)}
            placeholder="8"
          />
        </Field>
      </div>
      <Field label="Use of Funds" required error={errors.use_of_funds}>
        <div className="flex flex-wrap gap-2 rounded-md border border-input bg-secondary/30 p-3">
          {USE_OF_FUNDS_OPTIONS.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                  active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-border bg-card/40 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function TeamSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <Field label="Founder Background" required error={errors.founder_background} hint="Education, prior experience, exits">
        <textarea
          className={fieldTextareaClasses}
          value={(data.founder_background as string) ?? ""}
          onChange={(e) => update("founder_background", e.target.value)}
        />
      </Field>
      <Field label="Core Team Members" error={errors.core_team}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.core_team as string) ?? ""}
          onChange={(e) => update("core_team", e.target.value)}
          placeholder="Name — role — short bio"
        />
      </Field>
      <Field label="Advisors / Mentors" error={errors.advisors}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.advisors as string) ?? ""}
          onChange={(e) => update("advisors", e.target.value)}
        />
      </Field>
    </div>
  );
}

function StrategicSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <Field label="Why do you want to partner with FSV Capital?" required error={errors.why_fsv}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.why_fsv as string) ?? ""}
          onChange={(e) => update("why_fsv", e.target.value)}
        />
      </Field>
      <Field label="How can FSV Capital add value beyond funding?" required error={errors.fsv_value_add}>
        <textarea
          className={fieldTextareaClasses}
          value={(data.fsv_value_add as string) ?? ""}
          onChange={(e) => update("fsv_value_add", e.target.value)}
        />
      </Field>
      <Field label="Open to mentorship / cohort programs?">
        <div className="flex gap-2">
          {[true, false].map((v) => {
            const active = data.open_to_mentorship === v;
            return (
              <button
                key={String(v)}
                type="button"
                onClick={() => update("open_to_mentorship", v)}
                className={`flex-1 rounded-md border px-4 py-2.5 text-sm transition-all ${
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {v ? "Yes" : "No"}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function FileSlot({
  label,
  required,
  accept,
  pdfOnly,
  maxMb,
  file,
  error,
  onUpload,
  onRemove,
}: {
  label: string;
  required?: boolean;
  accept: string;
  pdfOnly?: boolean;
  maxMb?: number;
  file?: UploadedFile;
  error?: string;
  onUpload: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label} {required && <span className="ml-1 text-gold">*</span>}
      </p>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-gold/40 bg-gold/5 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-gold shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{file.name}</p>
              <p className="text-[11px] text-muted-foreground">{fmtSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-secondary/20 px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
        >
          <Upload className="h-4 w-4" />
          Click to upload {pdfOnly ? "(PDF only)" : ""} · max {maxMb ?? 25} MB
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}

function DocumentsSection({
  docs,
  onUpload,
  onRemove,
  error,
}: {
  docs: DocsState;
  onUpload: (
    file: File,
    slot: keyof Omit<DocsState, "additional"> | "additional",
    opts?: { pdfOnly?: boolean; maxMb?: number },
  ) => void;
  onRemove: (slot: keyof Omit<DocsState, "additional"> | { additional: number }) => void;
  error?: string;
}) {
  return (
    <div className="grid gap-5">
      <FileSlot
        label="Pitch Deck"
        required
        accept="application/pdf"
        pdfOnly
        maxMb={25}
        file={docs.pitch_deck}
        error={error}
        onUpload={(f) => onUpload(f, "pitch_deck", { pdfOnly: true, maxMb: 25 })}
        onRemove={() => onRemove("pitch_deck")}
      />
      <FileSlot
        label="Financial Model (optional)"
        accept=".pdf,.xls,.xlsx,.csv"
        maxMb={20}
        file={docs.financial_model}
        onUpload={(f) => onUpload(f, "financial_model", { maxMb: 20 })}
        onRemove={() => onRemove("financial_model")}
      />
      <FileSlot
        label="Product Demo / Screenshots (optional)"
        accept="image/*,.pdf,.mp4,.mov"
        maxMb={50}
        file={docs.product_demo}
        onUpload={(f) => onUpload(f, "product_demo", { maxMb: 50 })}
        onRemove={() => onRemove("product_demo")}
      />

      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Additional Documents (optional)
        </p>
        {(docs.additional ?? []).map((f, i) => (
          <div
            key={f.path}
            className="mb-2 flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/30 px-4 py-2.5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="truncate text-sm">{f.name}</p>
              <p className="text-[11px] text-muted-foreground">{fmtSize(f.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => onRemove({ additional: i })}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <FileSlot
          label=""
          accept="*/*"
          maxMb={25}
          onUpload={(f) => onUpload(f, "additional", { maxMb: 25 })}
          onRemove={() => {}}
        />
      </div>
    </div>
  );
}

function ComplianceSection({ data, update, errors }: SectionProps) {
  return (
    <div className="grid gap-5">
      <Field label="Is the company registered?">
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => update("company_registered", v)}
              className={`flex-1 rounded-md border px-4 py-2.5 text-sm transition-all ${
                data.company_registered === v
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-gold/40"
              }`}
            >
              {v ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Any legal issues?">
        <div className="flex gap-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              onClick={() => update("legal_issues", v)}
              className={`flex-1 rounded-md border px-4 py-2.5 text-sm transition-all ${
                data.legal_issues === v
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-gold/40"
              }`}
            >
              {v ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </Field>
      {data.legal_issues === true && (
        <Field label="Please explain" error={errors.legal_issues_explanation}>
          <textarea
            className={fieldTextareaClasses}
            value={(data.legal_issues_explanation as string) ?? ""}
            onChange={(e) => update("legal_issues_explanation", e.target.value)}
          />
        </Field>
      )}
      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-secondary/30 p-4 hover:border-gold/40">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-[oklch(0.82_0.14_85)]"
          checked={!!data.consent_given}
          onChange={(e) => update("consent_given", e.target.checked)}
        />
        <span className="text-sm leading-relaxed text-foreground">
          I consent to share the information submitted with FSV Capital and its partners for the
          purpose of investment evaluation, in line with the{" "}
          <a href="/privacy" target="_blank" className="text-gold underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          .
          {errors.consent_given && (
            <span className="mt-1 block text-[11px] font-medium text-destructive">
              {errors.consent_given}
            </span>
          )}
        </span>
      </label>
    </div>
  );
}

function ReviewSection({
  data,
  docs,
  score,
}: {
  data: FormState;
  docs: DocsState;
  score: number;
}) {
  const summary: { label: string; value: string }[] = [
    { label: "Startup", value: (data.startup_name as string) ?? "—" },
    { label: "Founder(s)", value: (data.founder_names as string) ?? "—" },
    { label: "Email", value: (data.contact_email as string) ?? "—" },
    { label: "Industry", value: (data.industry as string) ?? "—" },
    { label: "Stage", value: (data.current_stage as string) ?? "—" },
    {
      label: "Raising",
      value:
        data.amount_raising && data.currency
          ? `${data.amount_raising} ${data.currency}`
          : "—",
    },
    { label: "Funding stage", value: (data.funding_stage as string) ?? "—" },
    { label: "Pitch deck", value: docs.pitch_deck?.name ?? "Not uploaded" },
  ];
  const tier = score >= 80 ? "Hot lead" : score >= 50 ? "Review" : "Early signal";
  const tierColor = score >= 80 ? "text-success" : score >= 50 ? "text-gold" : "text-muted-foreground";

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Preliminary Deal Score
            </p>
            <p className="mt-1 font-display text-4xl gradient-text">{score} / 100</p>
          </div>
          <p className={`text-sm font-medium uppercase tracking-wider ${tierColor}`}>{tier}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Computed from market clarity, team strength, innovation signals, and traction. Final
          scoring is performed by FSV partners.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <tbody>
            {summary.map((row, i) => (
              <tr key={row.label} className={i % 2 ? "bg-secondary/20" : ""}>
                <td className="w-1/3 px-4 py-2.5 text-muted-foreground text-xs uppercase tracking-wider">
                  {row.label}
                </td>
                <td className="px-4 py-2.5 text-foreground">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Review the highlights above. Use <span className="text-foreground">Back</span> to amend any
        section before submitting.
      </p>
    </div>
  );
}
