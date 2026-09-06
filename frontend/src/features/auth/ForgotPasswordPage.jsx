import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

import AuthLayout from "./AuthLayout";
import { forgotPasswordSchema } from "../../lib/schemas/authSchemas";
import { mockForgotPassword } from "../../lib/mockAuth";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data) => {
    await mockForgotPassword(data);
    setSentEmail(data.email);
    setSent(true);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.09, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={
        sent
          ? `We've sent a reset link to ${sentEmail}`
          : "Enter your email and we'll send you a reset link"
      }
    >
      <AnimatePresence mode="wait">
        {sent ? (
          /* ── Success state ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center text-center gap-5 py-4"
          >
            {/* Animated checkmark circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-deep-green/10 flex items-center justify-center"
            >
              <CheckCircle size={32} className="text-deep-green" />
            </motion.div>

            <div className="space-y-1">
              <p className="text-sm text-warm-gray leading-relaxed">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-terracotta font-medium hover:text-terracotta-dark transition-colors"
                >
                  try a different email
                </button>
              </p>
            </div>

            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors mt-2"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          /* ── Form state ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Email */}
              <motion.div
                custom={0}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="mb-5"
              >
                <label className="block text-xs font-medium text-charcoal mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
                  />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="auth-input pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="field-error">{errors.email.message}</p>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div
                custom={1}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Back to login */}
            <motion.div
              custom={2}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 text-center"
            >
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
