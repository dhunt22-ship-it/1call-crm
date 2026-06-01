-- =========================================================================
-- SYSTEM: 1Call CRM Database Blueprint
-- ARCHITECT: Derek J. Hunt
-- DATE: May 31, 2026
-- =========================================================================

-- CLEANUP: Clear out existing tables if resetting the schema
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS customer_tier CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 1. ENUMS (Custom Application Constraints)
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'sales_rep');
CREATE TYPE customer_tier AS ENUM ('prospect', 'customer', 'client');

-- 2. USERS TABLE (Strict 6-User Team Architecture)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'sales_rep',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ACCOUNTS TABLE (The corporate entities being targeted)
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    website VARCHAR(255),
    tier customer_tier NOT NULL DEFAULT 'prospect',
    owner_id INT REFERENCES users(id) ON DELETE SET NULL, -- Retain account history if a rep departs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CONTACTS TABLE (The humans inside the target companies)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE CASCADE, -- CASCADING DELETION: Wipes contacts if account drops
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL, -- Dropdown labels: 'CEO', 'CFO', 'VP of Sales', 'Gatekeeper'
    email VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    is_primary_decision_maker BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DEALS TABLE (High-Velocity 1-Call Closed Opportunities)
CREATE TABLE deals (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE CASCADE, -- CASCADING DELETION: Wipes deals if account drops
    assigned_rep_id INT REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(50) NOT NULL DEFAULT 'Cold Call', -- 'Cold Call', 'Pitching', 'Closed Won', 'Closed Lost'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- 6. ACTIVITY LOGS TABLE (Notes, High-Velocity Outcomes, and Callbacks)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE CASCADE, -- CASCADING DELETION: Wipes history if account drops
    rep_id INT REFERENCES users(id) ON DELETE SET NULL,
    contact_id INT REFERENCES contacts(id) ON DELETE SET NULL,
    notes TEXT NOT NULL,
    call_outcome VARCHAR(100) NOT NULL, -- 'Connected', 'No Answer', 'Gatekeeper Blocked'
    callback_date TIMESTAMP WITH TIME ZONE, -- The Callback feature target
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INDEXES FOR HIGH-PERFORMANCE KPI AGGREGATIONS
-- Optimizes calculations for the 1-Call Close ratio and manager dashboards
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_rep ON deals(assigned_rep_id);
CREATE INDEX idx_activity_callbacks ON activity_logs(callback_date) WHERE callback_date IS NOT NULL;