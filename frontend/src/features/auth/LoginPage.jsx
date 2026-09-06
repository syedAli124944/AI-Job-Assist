import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import AuthLayout from "./AuthLayout";
import { loginSchema } from "../../lib/schemas/authSchemas";
import { mockLogin } from "../../lib/mockAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      await mockLogin(data);
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your job search"
    >

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <motion.div
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="mb-4"
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

        {/* Password */}
        <motion.div
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="mb-1"
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-charcoal">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-terracotta hover:text-terracotta-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray"
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="auth-input pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </motion.div>

        {/* Server error */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs mt-3 mb-1 text-center"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div
          custom={4}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="mt-5"
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
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Switch to register */}
      <motion.p
        custom={5}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-sm text-warm-gray mt-6"
      >
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-terracotta font-medium hover:text-terracotta-dark transition-colors"
        >
          Sign up
        </Link>
      </motion.p>
    </AuthLayout>
  );
}
