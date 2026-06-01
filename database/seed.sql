-- =========================================================================
-- SYSTEM: 1Call CRM Mock Data Seed Script
-- ARCHITECT: Derek J. Hunt
-- DATE: May 31, 2026
-- =========================================================================

-- 1. SEED THE 6-USER TEAM STRUCTURE
INSERT INTO users (name, email, role) VALUES
('Derek J. Hunt', 'derek@1call.com', 'owner'),
('Sarah Jenkins', 'sarah@1call.com', 'manager'),
('Alex Rivera', 'alex@1call.com', 'sales_rep'),
('Jordan Vance', 'jordan@1call.com', 'sales_rep'),
('Taylor Brooks', 'taylor@1call.com', 'sales_rep'),
('Morgan Stone', 'morgan@1call.com', 'sales_rep');

-- 2. SEED ACCOUNTS (Companies across your custom tiers)
INSERT INTO accounts (company_name, website, tier, owner_id) VALUES
('Acme Corporation', 'https://acme.com', 'prospect', 3),     -- Assigned to Alex
('Stark Industries', 'https://stark.com', 'customer', 3),    -- Assigned to Alex
('Wayne Enterprises', 'https://wayne.com', 'client', 4),     -- Assigned to Jordan
('Cyberdyne Systems', 'https://cyberdyne.com', 'prospect', 5),-- Assigned to Taylor
('Umbrella Corp', 'https://umbrella.com', 'customer', 6),    -- Assigned to Morgan
('Initech LLC', 'https://initech.com', 'prospect', 4);       -- Assigned to Jordan

-- 3. SEED CONTACTS (With specific title dropdown values)
INSERT INTO contacts (account_id, first_name, last_name, title, email, phone, is_primary_decision_maker) VALUES
(1, 'Arthur', 'Dent', 'Gatekeeper', 'adent@acme.com', '555-0142', false),
(1, 'Pepper', 'Potts', 'CEO', 'ppotts@acme.com', '555-0199', true),
(2, 'Tony', 'Stark', 'Founder', 'tony@stark.com', '555-3000', true),
(3, 'Bruce', 'Wayne', 'Chairman', 'bruce@wayne.com', '555-1939', true),
(3, 'Lucius', 'Fox', 'CFO', 'lfox@wayne.com', '555-1940', true),
(4, 'Miles', 'Dyson', 'VP of R&D', 'mdyson@cyberdyne.com', '555-1984', true),
(5, 'Albert', 'Wesker', 'Director', 'awesker@umbrella.com', '555-2002', true),
(6, 'Peter', 'Gibbons', 'Product Manager', 'peter@initech.com', '555-1999', false);

-- 4. SEED DEALS (To generate metrics for your 1-Call KPI dashboards)
-- High-velocity layout tracking historical wins and active pipeline states
INSERT INTO deals (account_id, assigned_rep_id, amount, stage, created_at, closed_at) VALUES
(1, 3, 4500.00, 'Cold Call', CURRENT_TIMESTAMP - INTERVAL '2 hours', NULL),
(2, 3, 12500.00, 'Closed Won', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '23 hours'),
(3, 4, 25000.00, 'Closed Won', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(3, 4, 35000.00, 'Closed Won', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 4, 15000.00, 'Closed Won', CURRENT_TIMESTAMP - INTERVAL '5 hours', CURRENT_TIMESTAMP - INTERVAL '4 hours'), -- 3rd win makes Wayne a 'Client'
(4, 5, 8500.00, 'Pitching', CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL),
(5, 6, 9000.00, 'Closed Won', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(6, 4, 3200.00, 'Closed Lost', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '6 days');

-- 5. SEED ACTIVITY LOGS (Historical notes, outcomes, and Callbacks)
INSERT INTO activity_logs (account_id, rep_id, contact_id, notes, call_outcome, callback_date) VALUES
(1, 3, 1, 'Spoke with Arthur. He refused to transfer me to the CEO. Will attempt alternate route.', 'Gatekeeper Blocked', NULL),
(2, 3, 3, 'Connected with Tony. Pitched the 1Call contract. Pitch went flawlessly. Signed and closed on the spot.', 'Connected', NULL),
(4, 5, 6, 'Miles was interested but requested a follow-up call once his system upgrade completes next week.', 'Connected', CURRENT_TIMESTAMP + INTERVAL '3 days'),
(6, 4, 8, 'Peter was stressed about his TPS reports. Aggressively hung up. Marked as Lost.', 'No Answer', NULL);