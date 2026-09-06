import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";
import DashboardPage from "./features/dashboard/DashboardPage";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboard placeholder */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
