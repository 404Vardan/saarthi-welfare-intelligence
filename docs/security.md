# Saarthi Security & Access Control Architecture

## Security Overview

Because Saarthi handles sensitive demographic, socioeconomic, and statutory document metadata, security is built into the architecture using a **defense-in-depth, fail-closed design**.

---

## 1. Role-Based Access Control (RBAC)

The application defines three distinct system roles managed in `rbac_migration.sql`:

```
               ┌────────────────────────┐
               │      AUTHENTICATION    │
               │    (Supabase Auth JWT) │
               └───────────┬────────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │  CITIZEN  │ │GOVERNMENT │ │   ADMIN   │
       └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
             │             │             │
        Own Data     Aggregated    System Meta &
        & Vault      Telemetry &   Verification
                     Saturation       Queues
```

### Fail-Closed Principle
- If a user's role cannot be determined from the database, the system defaults to `role: null` and **fails closed** (blocking access to both citizen vault and administrative interfaces).
- Unauthenticated requests are immediately redirected to `/login`.

---

## 2. PostgreSQL Row-Level Security (RLS) Policies

All application tables enforce PostgreSQL Row-Level Security:

### Table Invariants
- **`profiles`**: Citizens can only read and update their own record (`auth.uid() = id`).
- **`documents`**: Citizen users can insert and read only their own documents. Verification status can only be modified by authorized government/admin roles.
- **`applications`**: Citizens can only view and submit their own applications. They cannot mark applications as `APPROVED` or `REJECTED`.
- **`household_members`**: Citizens can only query and mutate members tied to their own profile ID.

### Self-Elevation Prevention Triggers
Database triggers explicitly abort attempts by non-admin users to elevate their privileges:
```sql
-- Security trigger preventing citizen self-elevation
CREATE OR REPLACE FUNCTION prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role != OLD.role AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Role escalation prohibited';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Storage Bucket Security

Statutory documents uploaded to Supabase Storage are isolated in private buckets:
- **Bucket Path Partitioning**: Objects are stored under `{user_id}/{filename}`.
- **Storage RLS**: Citizens can only read and write files within their own folder.
- **Authorized Government Access**: Verified government officials are granted read-only access to citizen folders strictly during official application review.

---

## 4. Edge-Isolated AI Secrets

- **Zero Client Bundling**: The Gemini API key is never bundled in frontend JavaScript bundles.
- **Serverless Proxy**: Client requests to the AI assistant call `supabase functions/ask-saarthi`, which validates authentication headers before communicating with the Gemini API.

---

## 5. Security Invariant Regression Testing

The automated test suite (`scripts/test-engine.js`) explicitly validates 16 security and RLS assertions across Test Groups 7 and 8:
- RBAC resolution and fail-closed handling on error.
- SQL helper verification (`is_admin()`, `is_government()`).
- Database trigger prevention of citizen self-verification.
- Storage cross-user read/write isolation.
- Client audit log tampering rejection.
