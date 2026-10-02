import React from 'react';
import HeroNetwork from './HeroNetwork';
import ProblemSection from './ProblemSection';
import IntelligenceSection from './IntelligenceSection';
import VerifiedEngineSection from './VerifiedEngineSection';
import ActionJourneySection from './ActionJourneySection';
import NationalIntelligenceSection from './NationalIntelligenceSection';
import FinalCTA from './FinalCTA';
import '../styles/saarthi-landing.css';

/**
 * SAARTHI — PRODUCTION LANDING PAGE
 * 
 * Orchestrates the full product-first narrative:
 * 1. Hero — The Living Welfare Network
 * 2. Section 02 — The Problem (Welfare is Everywhere. Discovery is Not.)
 * 3. Section 03 — The Saarthi Difference (From Fragmented Info to Personalized Intelligence)
 * 4. Section 04 — The Verified Intelligence Engine (AI assists. Verified rules decide.)
 * 5. Section 05 & 06 — From Discovery to Action & Document Readiness
 * 6. Section 07 — From Citizen Intelligence to NWIS (Policy intelligence)
 * 7. Section 08 — Final Call to Action
 */

export default function SaarthiLanding() {
  return (
    <div className="saarthi-landing-root">
      {/* Registration Marks for institutional ledger feel */}
      <div className="landing-reg-mark mark-tl" aria-hidden="true">+</div>
      <div className="landing-reg-mark mark-tr" aria-hidden="true">+</div>

      {/* 01. Hero — The Living Welfare Network */}
      <HeroNetwork />

      {/* 02. Problem — Welfare is Everywhere. Discovery is Not. */}
      <ProblemSection />

      {/* 03. Saarthi Difference — Reorganizing around the citizen */}
      <IntelligenceSection />

      {/* 04. Verified Engine — Deterministic Decision Traces */}
      <VerifiedEngineSection />

      {/* 05 & 06. Action Journey & Document Readiness */}
      <ActionJourneySection />

      {/* 07. National Welfare Intelligence System (NWIS) */}
      <NationalIntelligenceSection />

      {/* 08. Final Call to Action */}
      <FinalCTA />

      {/* Bottom corner registration marks */}
      <div className="landing-reg-mark mark-bl" aria-hidden="true">+</div>
      <div className="landing-reg-mark mark-br" aria-hidden="true">+</div>
    </div>
  );
}
