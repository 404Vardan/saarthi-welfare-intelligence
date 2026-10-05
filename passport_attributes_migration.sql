-- =========================================================================
-- SAARTHI WELFARE PASSPORT EXTENDED ATTRIBUTES MIGRATION
-- Adds adaptive, progressive disclosure profile columns to public.profiles
-- Preserves all existing columns, constraints, RLS policies, and users.
-- =========================================================================

-- 1. Extend profiles table with adaptive welfare dimensions
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS marital_status TEXT,
  ADD COLUMN IF NOT EXISTS taluka_block TEXT,
  ADD COLUMN IF NOT EXISTS minority_status TEXT,
  ADD COLUMN IF NOT EXISTS disability_percentage INTEGER,
  ADD COLUMN IF NOT EXISTS income_individual INTEGER,
  ADD COLUMN IF NOT EXISTS income_source TEXT,
  ADD COLUMN IF NOT EXISTS employment_sector TEXT,
  ADD COLUMN IF NOT EXISTS is_farmer_involved TEXT,
  ADD COLUMN IF NOT EXISTS farmer_type TEXT,
  ADD COLUMN IF NOT EXISTS land_holding_acres NUMERIC,
  ADD COLUMN IF NOT EXISTS irrigation_type TEXT,
  ADD COLUMN IF NOT EXISTS crop_category TEXT,
  ADD COLUMN IF NOT EXISTS owns_livestock TEXT,
  ADD COLUMN IF NOT EXISTS is_fisherfolk TEXT,
  ADD COLUMN IF NOT EXISTS institution_type TEXT,
  ADD COLUMN IF NOT EXISTS course_type TEXT,
  ADD COLUMN IF NOT EXISTS is_first_generation_learner TEXT,
  ADD COLUMN IF NOT EXISTS receives_scholarship TEXT,
  ADD COLUMN IF NOT EXISTS job_seeker TEXT,
  ADD COLUMN IF NOT EXISTS is_entrepreneur TEXT,
  ADD COLUMN IF NOT EXISTS has_vocational_training TEXT,
  ADD COLUMN IF NOT EXISTS has_labour_card TEXT,
  ADD COLUMN IF NOT EXISTS eshram_registered TEXT,
  ADD COLUMN IF NOT EXISTS has_electricity TEXT,
  ADD COLUMN IF NOT EXISTS has_drinking_water TEXT,
  ADD COLUMN IF NOT EXISTS has_toilet TEXT,
  ADD COLUMN IF NOT EXISTS has_lpg_connection TEXT,
  ADD COLUMN IF NOT EXISTS has_health_insurance TEXT,
  ADD COLUMN IF NOT EXISTS has_pmjay_or_state_cover TEXT,
  ADD COLUMN IF NOT EXISTS is_pregnant_or_lactating TEXT,
  ADD COLUMN IF NOT EXISTS jan_dhan_account TEXT,
  ADD COLUMN IF NOT EXISTS has_pension_enrolment TEXT,
  ADD COLUMN IF NOT EXISTS existing_benefits TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS passport_metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Add helpful metadata comment
COMMENT ON COLUMN public.profiles.existing_benefits IS 'Array of scheme IDs citizen already receives to prevent redundant recommendation.';
COMMENT ON COLUMN public.profiles.passport_metadata IS 'Extensible JSONB store for fine-grained scheme-specific parameters.';
