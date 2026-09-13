import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import CitizenLayout from './components/layout/CitizenLayout';
import GovernmentLayout from './components/layout/GovernmentLayout';
import OperationsLayout from './components/layout/OperationsLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Landing
import LandingPage from './pages/landing/LandingPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenProfile from './pages/citizen/Profile';
import CitizenHousehold from './pages/citizen/Household';
import CitizenBenefits from './pages/citizen/Benefits';
import CitizenActionPlan from './pages/citizen/ActionPlan';
import CitizenExplorer from './pages/citizen/Explorer';
import CitizenSchemeDetail from './pages/citizen/SchemeDetail';
import CitizenRecommendations from './pages/citizen/Recommendations';
import CitizenCompare from './pages/citizen/Compare';
import CitizenDocuments from './pages/citizen/Documents';
import CitizenApplications from './pages/citizen/Applications';
import CitizenAssistant from './pages/citizen/Assistant';
import CitizenNotifications from './pages/citizen/Notifications';
import CitizenSettings from './pages/citizen/Settings';
import CitizenLogin from './pages/citizen/Login';

// Government Pages
import GovDashboard from './pages/government/Dashboard';
import GovDistricts from './pages/government/Districts';
import GovPolicyLab from './pages/government/PolicyLab';
import GovGapAnalysis from './pages/government/GapAnalysis';
import GovFraud from './pages/government/Fraud';
import GovPerformance from './pages/government/Performance';
import GovReports from './pages/government/Reports';
import GovAudit from './pages/government/Audit';
import GovSettings from './pages/government/Settings';
import GovLogin from './pages/government/Login';

// Operations Pages
import OpsDashboard from './pages/operations/Dashboard';
import OpsRegistry from './pages/operations/Registry';
import OpsSchemeDetail from './pages/operations/SchemeDetail';
import OpsVerification from './pages/operations/Verification';
import OpsAddScheme from './pages/operations/AddScheme';
import OpsLogin from './pages/operations/Login';

export default function App() {
  return (
    <Routes>
      {/* 1. Public Landing */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* 2. Citizen Portal — requires citizen role */}
      <Route path="/citizen/login" element={<CitizenLogin />} />
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/citizen/dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="profile" element={<CitizenProfile />} />
        <Route path="household" element={<CitizenHousehold />} />
        <Route path="documents" element={<CitizenDocuments />} />
        <Route path="benefits" element={<CitizenBenefits />} />
        <Route path="explorer" element={<CitizenExplorer />} />
        <Route path="scheme/:id" element={<CitizenSchemeDetail />} />
        <Route path="recommendations" element={<CitizenRecommendations />} />
        <Route path="compare" element={<CitizenCompare />} />
        <Route path="action-plan" element={<CitizenActionPlan />} />
        <Route path="applications" element={<CitizenApplications />} />
        <Route path="notifications" element={<CitizenNotifications />} />
        <Route path="assistant" element={<CitizenAssistant />} />
        <Route path="settings" element={<CitizenSettings />} />
      </Route>

      {/* 3. Government Portal — requires government or admin role */}
      <Route path="/government/login" element={<GovLogin />} />
      <Route
        path="/government"
        element={
          <ProtectedRoute allowedRoles={['government', 'admin']}>
            <GovernmentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/government/dashboard" replace />} />
        <Route path="dashboard" element={<GovDashboard />} />
        <Route path="districts" element={<GovDistricts />} />
        <Route path="gap-analysis" element={<GovGapAnalysis />} />
        <Route path="performance" element={<GovPerformance />} />
        <Route path="fraud" element={<GovFraud />} />
        <Route path="policy-lab" element={<GovPolicyLab />} />
        <Route path="reports" element={<GovReports />} />
        <Route path="audit" element={<GovAudit />} />
        <Route path="settings" element={<GovSettings />} />
      </Route>

      {/* 4. Operations Portal — requires admin role */}
      <Route path="/operations/login" element={<OpsLogin />} />
      <Route
        path="/operations"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OperationsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/operations/dashboard" replace />} />
        <Route path="dashboard" element={<OpsDashboard />} />
        <Route path="registry" element={<OpsRegistry />} />
        <Route path="scheme/:id" element={<OpsSchemeDetail />} />
        <Route path="verification" element={<OpsVerification />} />
        <Route path="add-scheme" element={<OpsAddScheme />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
