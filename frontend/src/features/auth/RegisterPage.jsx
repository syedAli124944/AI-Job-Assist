import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, XCircle } from "lucide-react";

import AuthLayout from "./AuthLayout";
import { registerSchema } from "../../lib/schemas/authSchemas";
import { mockRegister } from "../../lib/mockAuth";

// Small password strength indicator
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password?.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password || "") },
    { label: "Number", ok: /[0-9]/.test(password || "") },
  ];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-2 flex flex-col gap-1"
    >
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-1.5">
          {c.ok ? (
            <CheckCircle2 size={12} className="text-deep-green" />
          ) : (
            <XCircle size={12} className="text-warm-gray" />
          )}
          <span className={`text-xs ${c.ok ? "text-deep-green" : "text-warm-gray"}`}>
            {c.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      await mockRegister(data);
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
      transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your AI-powered job search today"
    >

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full name */}
        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="mb-4">
          <label className="block text-xs font-medium text-charcoal mb-1.5">
            Full name
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              {...register("name")}
              type="text"
              placeholder="Sarah Johnson"
              autoComplete="name"
              className="auth-input pl-10"
            />
          </div>
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </motion.div>

        {/* Email */}
        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="mb-4">
          <label className="block text-xs font-medium text-charcoal mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="auth-input pl-10"
            />
          </div>
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </motion.div>

        {/* Password */}
        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="mb-4">
          <label className="block text-xs font-medium text-charcoal mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
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
          {errors.password && <p className="field-error">{errors.password.message}</p>}
          <PasswordStrength password={passwordValue} />
        </motion.div>

        {/* Confirm password */}
        <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="mb-2">
          <label className="block text-xs font-medium text-charcoal mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="auth-input pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword.message}</p>
          )}
        </motion.div>

        {/* Terms note */}
        <motion.p
          custom={6}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="text-xs text-warm-gray mt-3"
        >
          By creating an account, you agree to our{" "}
          <span className="text-terracotta cursor-pointer hover:underline">Terms of Service</span>{" "}
          and{" "}
          <span className="text-terracotta cursor-pointer hover:underline">Privacy Policy</span>.
        </motion.p>

        {/* Server error */}
        <AnimatePresence>
          {submitError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs mt-3 text-center"
            >
              {submitError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible" className="mt-5">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Switch to login */}
      <motion.p
        custom={8}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-sm text-warm-gray mt-6"
      >
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-terracotta font-medium hover:text-terracotta-dark transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  );
}
