import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

// Temporary placeholder until full dashboard is built
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 text-center gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 rounded-card bg-terracotta/10 flex items-center justify-center">
          <Briefcase size={28} className="text-terracotta" />
        </div>

        <div>
          <h1 className="font-fraunces text-3xl text-charcoal mb-2">
            You're in! 🎉
          </h1>
          <p className="text-warm-gray text-sm max-w-xs">
            Dashboard is coming soon. Auth is working perfectly — token saved in localStorage.
          </p>
        </div>

        <Link
          to="/auth/login"
          className="text-sm text-terracotta font-medium hover:text-terracotta-dark transition-colors mt-2"
        >
          ← Back to login
        </Link>
      </motion.div>
    </div>
  );
}
