import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Reusable animated wrapper for auth pages
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-4 py-12">
      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-1 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-fraunces font-semibold text-charcoal text-lg tracking-tight">
            AI JobAssist
          </span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="auth-card w-full"
      >
        {/* Header text */}
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h1 className="font-fraunces text-2xl text-charcoal mb-1">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-warm-gray text-sm">{subtitle}</p>
            )}
          </div>
        )}

        {children}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 text-warm-gray text-xs text-center"
      >
        © 2025 Hireflow. Your AI career companion.
      </motion.p>
    </div>
  );
}
