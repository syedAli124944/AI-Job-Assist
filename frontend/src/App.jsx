import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Auth
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";

// Landing
import LandingPage from "./features/landing/LandingPage";

// Protected
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardPage from "./features/dashboard/DashboardPage";
import OnboardingPage from "./features/onboarding/OnboardingPage";
import JobSearchPage from "./features/jobs/JobSearchPage";
import JobDetailPage from "./features/jobs/JobDetailPage";
import CoverLetterPage from "./features/coverletter/CoverLetterPage";
import ApplicationTrackerPage from "./features/tracker/ApplicationTrackerPage";
import NotificationsPage from "./features/notifications/NotificationsPage";

import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected app routes */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobSearchPage /></ProtectedRoute>} />
        <Route path="/jobs/:id/*" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
        <Route path="/cover-letter/:jobId/*" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
        <Route path="/cover-letter/:jobId" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
        <Route path="/cover-letter/*" element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationTrackerPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  </>
);
}
