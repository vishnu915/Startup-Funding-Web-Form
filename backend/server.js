const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== CREATE UPLOAD FOLDER ==================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Uploads folder created ✅");
}

// ================== MULTER CONFIG ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ FIXED (absolute path)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ================== FILE UPLOAD API ==================
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "File uploaded successfully ✅",
      path: req.file.path,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ================== APPLICATION SUBMIT API ==================
app.post("/api/application", (req, res) => {
  try {
    const data = req.body;

    console.log("Incoming Data:", data);

    const sql = `
      INSERT INTO applications (
        startup_name, website_url, founder_names, contact_email, contact_number,
        founder_linkedin, company_linkedin, hq_city, hq_country, year_incorporation,

        problem_statement, solution_overview, industry, business_model, current_stage,

        core_product, tech_stack, usp, ip_patents, demo_link,

        tam, sam, som, customer_segment, competitors, competitive_advantage,

        monthly_revenue, annual_revenue, growth_rate, customer_count, partnerships, achievements,

        funding_raised, existing_investors, burn_rate, runway_months, revenue_projections,

        amount_raising, currency, funding_stage, equity_offered, use_of_funds,

        founder_background, core_team, advisors,

        why_fsv, fsv_value_add, open_to_mentorship,

        pitch_deck_path, financial_model_path, product_demo_path, additional_docs_paths,

        company_registered, legal_issues, legal_issues_explanation, consent_given,

        deal_score
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?
      )
    `;

    const values = [
      // BASIC
      data.startup_name,
      data.website_url,
      data.founder_names,
      data.contact_email,
      data.contact_number,
      data.founder_linkedin,
      data.company_linkedin,
      data.hq_city,
      data.hq_country,
      data.year_incorporation,

      // OVERVIEW
      data.problem_statement,
      data.solution_overview,
      data.industry,
      data.business_model,
      data.current_stage,

      // PRODUCT
      data.core_product,
      data.tech_stack,
      data.usp,
      data.ip_patents,
      data.demo_link,

      // MARKET
      data.tam,
      data.sam,
      data.som,
      data.customer_segment,
      data.competitors,
      data.competitive_advantage,

      // TRACTION
      data.monthly_revenue,
      data.annual_revenue,
      data.growth_rate,
      data.customer_count,
      data.partnerships,
      data.achievements,

      // FINANCIALS
      data.funding_raised,
      data.existing_investors,
      data.burn_rate,
      data.runway_months,
      data.revenue_projections,

      // FUNDING
      data.amount_raising,
      data.currency,
      data.funding_stage,
      data.equity_offered,
      data.use_of_funds,

      // TEAM
      data.founder_background,
      data.core_team,
      data.advisors,

      // STRATEGIC
      data.why_fsv,
      data.fsv_value_add,
      data.open_to_mentorship,

      // DOCUMENTS
      data.pitch_deck_path,
      data.financial_model_path,
      data.product_demo_path,
      JSON.stringify(data.additional_docs_paths || []),

      // COMPLIANCE
      data.company_registered,
      data.legal_issues,
      data.legal_issues_explanation,
      data.consent_given,

      // SCORE
      data.deal_score || 0,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      res.json({
        message: "Application submitted successfully ✅",
        id: result.insertId,
      });
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== START SERVER ==================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});