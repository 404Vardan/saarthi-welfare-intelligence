# SAARTHI 2.0 — Production Deployment & Architecture Runbook

This document outlines the complete deployment runbook to deploy **Saarthi Welfare Intelligence Platform v2.0** to production (Vercel / Netlify / Custom Domain) backed by Supabase PostgreSQL RLS and Gemini AI Edge Proxy.

---

## 🏗️ Architecture Overview

```
                 INTERNET
                    │
                    ▼
           SAARTHI WEB APP (v2.0)
      (Vercel / Cloudflare / Netlify)
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Supabase          Gemini 1.5 Flash
   (PostgreSQL + RLS)  (via Edge Function)
          │
   ┌──────┼────────┐
   ▼      ▼        ▼
 Database Auth  Storage
 (Tables) (RBAC) (Private)
```

---

## 1. Environment Variables Configuration

Create a `.env` file (or set environment variables in your hosting provider):

```env
# Supabase Production Project URL & Anonymous Public Key (Frontend Safe)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Notice**: Gemini API keys are configured exclusively on the backend via `supabase secrets set GEMINI_API_KEY=...` and are NEVER bundled into client frontend code.

---

## 2. PostgreSQL Database & RBAC Setup

Execute the SQL migration scripts in order in your **Supabase SQL Editor**:

1. `migration.sql`: Core schema (profiles, applications, documents, household_members).
2. `rbac_migration.sql`: RBAC roles (`citizen`, `government`, `admin`), triggers for auto-assigning citizen roles on signup, and Row-Level Security policies.
3. `registry_migration.sql`: Scheme registry tables, versions, sources, and verification queues.

---

## 3. Supabase Edge Function Deployment (ask-saarthi)

Deploy the secure Gemini API proxy edge function so that API keys stay server-side:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login and link to your remote project
supabase login
supabase link --project-ref your-project-ref

# Set Gemini API Key secret on the remote Supabase project
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Deploy the Edge Function
supabase functions deploy ask-saarthi
```

---

## 4. Build & Deployment via Vercel / Netlify

### Option A: Deploy via Vercel CLI / Web UI
1. Connect your GitHub repository `404Vardan/saarthi-welfare-intelligence`.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY`).
5. Click **Deploy**.

### Option B: Local Production Build Test
```bash
npm run build
npm run preview
```

---

## 5. Beta Cohort Testing (20–50 Users)

Share the direct link to the **Beta User Guide**:
- URL: `https://your-domain.com/beta-guide`
- Follow the 5 structured personas (Farmer, Student, Woman Head, Artisan, Senior Citizen).
- Monitor incoming reviews and telemetry in `/operations/analytics`.
