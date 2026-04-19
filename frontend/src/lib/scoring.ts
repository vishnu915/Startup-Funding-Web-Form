import type { ApplicationData } from "./application-schema";

/**
 * Smart Deal Score (0–100):
 * - Market: 25 pts (TAM signal + market clarity)
 * - Team: 25 pts (founder background + advisors completeness)
 * - Innovation: 20 pts (IP + tech stack + USP depth)
 * - Traction: 30 pts (revenue, growth, customers)
 */
export function computeDealScore(data: Partial<ApplicationData>): number {
  let score = 0;

  // Market (25)
  if (data.tam) score += 10;
  if (data.sam) score += 5;
  if (data.som) score += 5;
  if ((data.customer_segment?.length ?? 0) > 30) score += 5;

  // Team (25)
  if ((data.founder_background?.length ?? 0) > 80) score += 12;
  if ((data.core_team?.length ?? 0) > 40) score += 8;
  if ((data.advisors?.length ?? 0) > 20) score += 5;

  // Innovation (20)
  if (data.ip_patents && data.ip_patents.toLowerCase() !== "none") score += 7;
  if ((data.tech_stack?.length ?? 0) > 20) score += 6;
  if ((data.usp?.length ?? 0) > 60) score += 7;

  // Traction (30)
  const stage = data.current_stage;
  if (stage === "Scaling") score += 12;
  else if (stage === "Growth Stage") score += 10;
  else if (stage === "Early Revenue") score += 7;
  else if (stage === "MVP") score += 4;
  if (data.annual_revenue && data.annual_revenue !== "0") score += 8;
  if (data.growth_rate) score += 5;
  if (data.customer_count) score += 5;

  return Math.min(100, score);
}
