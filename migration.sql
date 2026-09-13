-- Clean slate: drop all existing Saarthi tables and functions
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS saved_schemes CASCADE;
DROP TABLE IF EXISTS household_members CASCADE;
DROP TABLE IF EXISTS synthetic_citizens CASCADE;
DROP TABLE IF EXISTS schemes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS evaluate_eligibility CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  income_annual INTEGER DEFAULT 0,
  occupation TEXT CHECK (occupation IN ('farmer', 'salaried', 'self_employed', 'student', 'unemployed', 'retired', 'artisan', 'daily_wage', 'street_vendor', 'homemaker', 'other')),
  state TEXT,
  district TEXT,
  pincode TEXT,
  area_type TEXT CHECK (area_type IN ('rural', 'urban', 'semi_urban')),
  land_ownership TEXT CHECK (land_ownership IN ('none', 'below_2_acres', '2_to_5_acres', 'above_5_acres')),
  house_ownership TEXT CHECK (house_ownership IN ('none', 'kuccha', 'pucca', 'rented')),
  category TEXT CHECK (category IN ('general', 'obc', 'sc', 'st', 'ews')),
  disability TEXT DEFAULT 'none' CHECK (disability IN ('none', 'physical', 'visual', 'hearing', 'intellectual', 'multiple')),
  education TEXT CHECK (education IN ('none', 'primary', 'secondary', 'higher_secondary', 'graduate', 'post_graduate')),
  household_size INTEGER DEFAULT 1,
  is_student BOOLEAN DEFAULT FALSE,
  is_farmer BOOLEAN DEFAULT FALSE,
  is_senior BOOLEAN DEFAULT FALSE,
  is_woman_head BOOLEAN DEFAULT FALSE,
  bpl_card BOOLEAN DEFAULT FALSE,
  ration_card_type TEXT DEFAULT 'none' CHECK (ration_card_type IN ('none', 'aay', 'phh', 'nphh')),
  bank_account BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relation TEXT NOT NULL CHECK (relation IN ('spouse', 'child', 'parent', 'sibling', 'other')),
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  occupation TEXT,
  income_annual INTEGER DEFAULT 0,
  education TEXT,
  disability TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  benefit TEXT NOT NULL,
  benefit_amount TEXT,
  documents TEXT[] DEFAULT '{}',
  rules JSONB NOT NULL DEFAULT '{}',
  type TEXT CHECK (type IN ('direct_benefit', 'subsidy', 'insurance', 'pension', 'loan', 'skill_training', 'employment')),
  beneficiary_tags TEXT[] DEFAULT '{}',
  gov_level TEXT CHECK (gov_level IN ('central', 'state', 'joint')),
  state TEXT,
  category_tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'closed')),
  popularity_score INTEGER DEFAULT 50,
  added_date DATE DEFAULT CURRENT_DATE,
  deadline DATE,
  processing_days INTEGER DEFAULT 30,
  success_rate INTEGER DEFAULT 75,
  income_limit INTEGER,
  min_age INTEGER,
  max_age INTEGER,
  ministry TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, scheme_id)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'identity',
  document_number TEXT,
  file_type TEXT,
  file_url TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'under_review', 'verified', 'rejected', 'expiring_soon', 'expired')),
  expiry_date DATE,
  issuing_authority TEXT,
  analysis_result JSONB,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE NOT NULL,
  reference_number TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'documents_requested', 'approved', 'rejected', 'disbursed')),
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  timeline JSONB DEFAULT '[]'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'action_required')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE synthetic_citizens (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  occupation TEXT,
  income_annual INTEGER,
  state TEXT,
  district TEXT,
  area_type TEXT,
  category TEXT,
  disability TEXT,
  education TEXT,
  bpl_card BOOLEAN,
  ration_card_type TEXT,
  land_ownership TEXT,
  house_ownership TEXT,
  bank_account BOOLEAN,
  household_members JSONB DEFAULT '[]',
  eligibility_results JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_update_insert_own_profiles" ON profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_household_members" ON household_members FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_schemes" ON schemes FOR SELECT USING (true);

ALTER TABLE saved_schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_saved_schemes" ON saved_schemes FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_documents" ON documents FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_applications" ON applications FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_notifications" ON notifications FOR ALL USING (auth.uid() = profile_id);

ALTER TABLE synthetic_citizens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_synthetic_citizens" ON synthetic_citizens FOR SELECT USING (true);

-- TRIGGER for auto-creating profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- SEED DATA — 15 REAL INDIAN WELFARE SCHEMES
INSERT INTO schemes (name, short_name, benefit, benefit_amount, rules, type, beneficiary_tags, gov_level, processing_days, success_rate, popularity_score, income_limit, ministry) VALUES
('Pradhan Mantri Kisan Samman Nidhi', 'PM-KISAN', '₹6,000/year in 3 installments', '₹6000', '{"income_limit": 200000, "income_type": "household", "occupation": ["farmer"], "land_ownership": ["below_2_acres", "2_to_5_acres"], "bank_account_required": true}', 'direct_benefit', '{"farmer", "agriculture"}', 'central', 45, 82, 95, 200000, 'Ministry of Agriculture'),
('Ayushman Bharat (PMJAY)', 'PMJAY', 'Health insurance up to ₹5,00,000/family/year', '₹500000', '{"income_limit": 500000, "income_type": "household", "bpl_required": true, "custom_rules": ["BPL or deprivation criteria"]}', 'insurance', '{"health", "all beneficiaries"}', 'central', 15, 88, 92, 500000, 'Ministry of Health'),
('PM Awas Yojana (Gramin)', 'PMAY-G', '₹1,20,000 - ₹1,50,000 housing subsidy', '₹150000', '{"income_limit": 300000, "income_type": "household", "area_type": ["rural"], "house_ownership": ["none", "kuccha"]}', 'subsidy', '{"housing"}', 'central', 90, 65, 88, 300000, 'Ministry of Rural Development'),
('Indira Gandhi National Old Age Pension Scheme', 'IGNOAPS', '₹200-₹500/month pension', '₹500', '{"income_limit": 200000, "income_type": "household", "min_age": 60, "bpl_required": true}', 'pension', '{"senior", "social_security"}', 'central', 30, 78, 75, 200000, 'Ministry of Rural Development'),
('National Post-Matric Scholarship', 'Post-Matric', 'Tuition fees + ₹380-₹1,200/month maintenance', '₹1200', '{"income_limit": 250000, "income_type": "household", "max_age": 35, "category": ["sc", "st", "obc"], "occupation": ["student"], "education": ["secondary", "higher_secondary", "graduate", "post_graduate"]}', 'direct_benefit', '{"student", "education"}', 'central', 60, 72, 70, 250000, 'Ministry of Social Justice'),
('PM Ujjwala Yojana', 'PMUY', 'Free LPG connection + first refill', 'LPG', '{"income_limit": 200000, "income_type": "household", "gender": ["female"], "bpl_required": true}', 'subsidy', '{"women", "social_security"}', 'central', 21, 90, 85, 200000, 'Ministry of Petroleum'),
('Sukanya Samriddhi Yojana', 'SSY', 'Investment scheme with 8.2% interest for girl child', '8.2% interest', '{"has_girl_child_under": 10, "bank_account_required": true}', 'direct_benefit', '{"women", "child", "financial_inclusion"}', 'central', 7, 95, 80, null, 'Ministry of Finance'),
('Atal Pension Yojana', 'APY', 'Guaranteed pension ₹1,000-₹5,000/month after 60', '₹5000', '{"min_age": 18, "max_age": 40, "occupation": ["farmer", "self_employed", "daily_wage", "artisan"], "bank_account_required": true}', 'pension', '{"worker", "financial_inclusion"}', 'central', 14, 85, 78, null, 'Ministry of Finance'),
('MGNREGA', 'MGNREGA', '100 days guaranteed employment at ₹267-₹333/day', '₹333/day', '{"min_age": 18, "area_type": ["rural"]}', 'employment', '{"worker", "employment"}', 'central', 15, 80, 90, null, 'Ministry of Rural Development'),
('PM Mudra Yojana', 'MUDRA', 'Loans ₹50,000 - ₹10,00,000 for business', '₹1000000', '{"min_age": 18, "max_age": 65, "occupation": ["self_employed", "artisan"], "bank_account_required": true}', 'loan', '{"entrepreneur", "financial_inclusion"}', 'central', 21, 70, 82, null, 'Ministry of Finance'),
('National Family Benefit Scheme', 'NFBS', '₹20,000 lump sum to bereaved family', '₹20000', '{"income_limit": 200000, "income_type": "household", "bpl_required": true}', 'direct_benefit', '{"social_security"}', 'central', 45, 68, 55, 200000, 'Ministry of Rural Development'),
('Kisan Credit Card', 'KCC', 'Credit up to ₹3,00,000 at 4% interest', '₹300000', '{"occupation": ["farmer"], "land_ownership": ["below_2_acres", "2_to_5_acres", "above_5_acres"], "bank_account_required": true}', 'loan', '{"farmer", "agriculture", "financial_inclusion"}', 'central', 14, 85, 88, null, 'Ministry of Agriculture'),
('PM Vishwakarma', 'Vishwakarma', 'Skill training + toolkit + up to ₹3,00,000 collateral-free loan', '₹300000', '{"min_age": 18, "occupation": ["artisan", "daily_wage"]}', 'skill_training', '{"worker", "artisan", "employment"}', 'central', 30, 75, 65, null, 'Ministry of MSME'),
('Stand-Up India', 'Stand-Up', 'Loans ₹10,00,000 - ₹1,00,00,000 for enterprise', '₹10000000', '{"min_age": 18, "max_age": 65, "occupation": ["self_employed"], "category": ["sc", "st"], "gender": ["female"], "bank_account_required": true}', 'loan', '{"entrepreneur", "women", "employment"}', 'central', 30, 62, 60, null, 'Ministry of Finance'),
('PM Fasal Bima Yojana', 'PMFBY', 'Crop insurance at 1.5-5% premium', 'Crop Insurance', '{"occupation": ["farmer"], "land_ownership": ["below_2_acres", "2_to_5_acres", "above_5_acres"]}', 'insurance', '{"farmer", "agriculture"}', 'central', 30, 78, 75, null, 'Ministry of Agriculture');

-- SEED SYNTHETIC CITIZENS
INSERT INTO synthetic_citizens (id, full_name, age, gender, occupation, income_annual, state, district, area_type, category, disability, education, bpl_card, ration_card_type, land_ownership, house_ownership, bank_account, household_members, eligibility_results) VALUES
('CIT-2026-001247', 'Ramesh Kumar Yadav', 45, 'male', 'farmer', 120000, 'UP', 'Varanasi', 'rural', 'obc', 'none', 'secondary', false, 'phh', 'below_2_acres', 'kuccha', true, '[{"name": "Sunita", "age": 40, "gender": "female", "relation": "spouse", "occupation": "homemaker", "income_annual": 0}, {"name": "Amit", "age": 18, "gender": "male", "relation": "child", "occupation": "student", "income_annual": 0}, {"name": "Priya", "age": 14, "gender": "female", "relation": "child", "occupation": "student", "income_annual": 0}]', '[{"schemeId": "PM-KISAN", "schemeName": "Pradhan Mantri Kisan Samman Nidhi", "status": "eligible", "matchPercentage": 100}]'),
('CIT-2026-003891', 'Lakshmi Devi', 62, 'female', 'unemployed', 0, 'Rajasthan', 'Jodhpur', 'rural', 'sc', 'none', 'none', true, 'aay', 'none', 'kuccha', true, '[{"name": "Mohan", "age": 35, "gender": "male", "relation": "child", "occupation": "daily_wage", "income_annual": 60000}]', '[{"schemeId": "IGNOAPS", "schemeName": "Indira Gandhi National Old Age Pension Scheme", "status": "eligible", "matchPercentage": 100}]'),
('CIT-2026-005432', 'Ankit Sharma', 22, 'male', 'student', 0, 'Maharashtra', 'Pune', 'urban', 'general', 'none', 'graduate', false, 'none', 'none', 'rented', true, '[{"name": "Rajesh", "age": 52, "gender": "male", "relation": "parent", "occupation": "salaried", "income_annual": 350000}, {"name": "Meena", "age": 48, "gender": "female", "relation": "parent", "occupation": "homemaker", "income_annual": 0}]', '[]'),
('CIT-2026-007104', 'Fatima Begum', 35, 'female', 'self_employed', 180000, 'Kerala', 'Kozhikode', 'semi_urban', 'obc', 'none', 'higher_secondary', false, 'phh', 'none', 'rented', true, '[{"name": "Ahmed", "age": 38, "gender": "male", "relation": "spouse", "occupation": "self_employed", "income_annual": 140000}, {"name": "Ayesha", "age": 8, "gender": "female", "relation": "child", "occupation": "student", "income_annual": 0}]', '[{"schemeId": "SSY", "schemeName": "Sukanya Samriddhi Yojana", "status": "eligible", "matchPercentage": 100}]'),
('CIT-2026-009876', 'Suresh Meena', 55, 'male', 'farmer', 90000, 'MP', 'Gwalior', 'rural', 'st', 'none', 'primary', true, 'aay', 'below_2_acres', 'kuccha', true, '[{"name": "Kamla", "age": 50, "gender": "female", "relation": "spouse", "occupation": "unemployed", "income_annual": 0}, {"name": "Devi Bai", "age": 78, "gender": "female", "relation": "parent", "occupation": "unemployed", "income_annual": 0}, {"name": "Raju", "age": 25, "gender": "male", "relation": "child", "occupation": "daily_wage", "income_annual": 50000}]', '[{"schemeId": "PM-KISAN", "schemeName": "Pradhan Mantri Kisan Samman Nidhi", "status": "eligible", "matchPercentage": 100}]');
