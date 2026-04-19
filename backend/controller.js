import db from "./db.js";

export const submitApplication = (req, res) => {
  const data = req.body;

  const query = `
    INSERT INTO applications (
      startup_name, website_url, founder_names, contact_email,
      contact_number, problem_statement, solution_overview,
      industry, business_model, current_stage,
      core_product, tech_stack, usp,
      tam, sam, som,
      monthly_revenue, annual_revenue,
      funding_raised, burn_rate,
      amount_raising, currency,
      founder_background,
      pitch_deck_path,
      deal_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.startup_name,
    data.website_url,
    data.founder_names,
    data.contact_email,
    data.contact_number,
    data.problem_statement,
    data.solution_overview,
    data.industry,
    data.business_model,
    data.current_stage,
    data.core_product,
    data.tech_stack,
    data.usp,
    data.tam,
    data.sam,
    data.som,
    data.monthly_revenue,
    data.annual_revenue,
    data.funding_raised,
    data.burn_rate,
    data.amount_raising,
    data.currency,
    data.founder_background,
    data.pitch_deck_path,
    data.deal_score
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Data Stored Successfully ✅" });
  });
};