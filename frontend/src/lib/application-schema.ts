import { z } from "zod";

const optStr = (max = 2000) =>
  z.string().trim().max(max).optional().or(z.literal("").transform(() => undefined));

export const stepSchemas = {
  // 1. Basic
  basic: z.object({
    startup_name: z.string().trim().min(2, "Startup name is required").max(120),
    website_url: optStr(255),
    founder_names: z.string().trim().min(2, "Founder name is required").max(255),
    contact_email: z.string().trim().email("Valid email required").max(255),
    contact_number: optStr(40),
    founder_linkedin: optStr(255),
    company_linkedin: optStr(255),
    hq_city: optStr(100),
    hq_country: optStr(100),
    year_incorporation: z
      .union([z.coerce.number().int().min(1980).max(new Date().getFullYear()), z.literal("").transform(() => undefined)])
      .optional(),
  }),
  // 2. Overview
  overview: z.object({
    problem_statement: z.string().trim().min(20, "Please describe the problem (min 20 chars)").max(2000),
    solution_overview: z.string().trim().min(20, "Please describe the solution").max(2000),
    industry: z.string().min(1, "Select an industry"),
    business_model: z.string().min(1, "Select a business model"),
    current_stage: z.enum(["Idea", "MVP", "Early Revenue", "Growth Stage", "Scaling"], {
      message: "Select your current stage",
    }),
  }),
  // 3. Product
  product: z.object({
    core_product: z.string().trim().min(20).max(2000),
    tech_stack: z.string().trim().min(2).max(500),
    usp: z.string().trim().min(10).max(1000),
    ip_patents: optStr(500),
    demo_link: optStr(500),
  }),
  // 4. Market
  market: z.object({
    tam: z.string().trim().min(1, "TAM required").max(100),
    sam: optStr(100),
    som: optStr(100),
    customer_segment: z.string().trim().min(5).max(500),
    competitors: optStr(500),
    competitive_advantage: z.string().trim().min(10).max(1000),
  }),
  // 5. Traction
  traction: z.object({
    monthly_revenue: optStr(50),
    annual_revenue: optStr(50),
    growth_rate: optStr(50),
    customer_count: optStr(50),
    partnerships: optStr(500),
    achievements: optStr(500),
  }),
  // 6. Financials
  financials: z.object({
    funding_raised: optStr(50),
    existing_investors: optStr(500),
    burn_rate: optStr(50),
    runway_months: optStr(50),
    revenue_projections: optStr(1000),
  }),
  // 7. Funding ask
  funding: z.object({
    amount_raising: z.string().trim().min(1, "Amount required").max(50),
    currency: z.enum(["USD", "INR"], { message: "Select currency" }),
    funding_stage: z.string().min(1, "Select funding stage"),
    equity_offered: optStr(20),
    use_of_funds: z.string().trim().min(5).max(1000),
  }),
  // 8. Team
  team: z.object({
    founder_background: z.string().trim().min(20).max(2000),
    core_team: optStr(2000),
    advisors: optStr(1000),
  }),
  // 9. Strategic Fit
  strategic: z.object({
    why_fsv: z.string().trim().min(20, "Tell us why FSV").max(1500),
    fsv_value_add: z.string().trim().min(10).max(1500),
    open_to_mentorship: z.boolean(),
  }),
  // 11. Compliance (10 = documents handled separately)
  compliance: z.object({
    company_registered: z.boolean(),
    legal_issues: z.boolean(),
    legal_issues_explanation: optStr(1000),
    consent_given: z.literal(true, { message: "Consent is required to submit" }),
  }),
};

export const fullApplicationSchema = z.object({
  ...stepSchemas.basic.shape,
  ...stepSchemas.overview.shape,
  ...stepSchemas.product.shape,
  ...stepSchemas.market.shape,
  ...stepSchemas.traction.shape,
  ...stepSchemas.financials.shape,
  ...stepSchemas.funding.shape,
  ...stepSchemas.team.shape,
  ...stepSchemas.strategic.shape,
  ...stepSchemas.compliance.shape,
});

export type ApplicationData = z.infer<typeof fullApplicationSchema>;

export const INDUSTRIES = [
  "DeepTech",
  "Fintech",
  "AI / Machine Learning",
  "Blockchain / Web3",
  "SaaS",
  "Healthtech",
  "Edtech",
  "Climate / Cleantech",
  "E-commerce",
  "Other",
];

export const BUSINESS_MODELS = ["B2B", "B2C", "B2B2C", "Marketplace", "SaaS Subscription", "Transactional", "Other"];

export const FUNDING_STAGES = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Bridge"];

export const USE_OF_FUNDS_OPTIONS = [
  "Product development",
  "Go-to-market",
  "Hiring",
  "Geographic expansion",
  "R&D",
  "Marketing",
  "Operations",
];
