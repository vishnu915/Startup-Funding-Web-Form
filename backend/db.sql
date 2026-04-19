
create database if not exists startup_app;
USE startup_app;

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- ✅ BASIC INFO
  startup_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(255),
  founder_names TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  founder_linkedin VARCHAR(255),
  company_linkedin VARCHAR(255),
  hq_city VARCHAR(100),
  hq_country VARCHAR(100),
  year_incorporation INT,

  -- ✅ OVERVIEW
  problem_statement TEXT,
  solution_overview TEXT,
  industry VARCHAR(100),
  business_model VARCHAR(100),
  current_stage VARCHAR(50),

  -- ✅ PRODUCT
  core_product TEXT,
  tech_stack TEXT,
  usp TEXT,
  ip_patents TEXT,
  demo_link VARCHAR(255),

  -- ✅ MARKET
  tam VARCHAR(50),
  sam VARCHAR(50),
  som VARCHAR(50),
  customer_segment TEXT,
  competitors TEXT,
  competitive_advantage TEXT,

  -- ✅ TRACTION
  monthly_revenue VARCHAR(50),
  annual_revenue VARCHAR(50),
  growth_rate VARCHAR(50),
  customer_count VARCHAR(50),
  partnerships TEXT,
  achievements TEXT,

  -- ✅ FINANCIALS
  funding_raised VARCHAR(50),
  existing_investors TEXT,
  burn_rate VARCHAR(50),
  runway_months VARCHAR(50),
  revenue_projections TEXT,

  -- ✅ FUNDING
  amount_raising VARCHAR(50),
  currency VARCHAR(10),
  funding_stage VARCHAR(50),
  equity_offered VARCHAR(50),
  use_of_funds TEXT,

  -- ✅ TEAM
  founder_background TEXT,
  core_team TEXT,
  advisors TEXT,

  -- ✅ STRATEGIC
  why_fsv TEXT,
  fsv_value_add TEXT,
  open_to_mentorship BOOLEAN,

  -- ✅ DOCUMENTS
  pitch_deck_path TEXT,
  financial_model_path TEXT,
  product_demo_path TEXT,

  -- 🔥 IMPORTANT (ARRAY FIX)
  additional_docs_paths JSON,

  -- ✅ COMPLIANCE
  company_registered BOOLEAN,
  legal_issues BOOLEAN,
  legal_issues_explanation TEXT,
  consent_given BOOLEAN,

  -- ✅ SCORE
  deal_score INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

