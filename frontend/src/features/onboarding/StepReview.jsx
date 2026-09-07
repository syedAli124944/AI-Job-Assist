import { useState } from "react";
import { motion as m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2, ArrowLeft, FileText, Briefcase, MapPin, DollarSign, Rocket } from "lucide-react";
import { savePreferencesApi } from "../../services/backendApi";

export default function StepReview({ onBack, cvData, preferences }) {
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await savePreferencesApi(preferences);
    } catch {
      // Graceful fallback if offline
    }
    localStorage.setItem("onboarding_complete", "true");
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deep-green/10 text-deep-green text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={13} /> Step 3 of 3
        </span>
        <h2 className="font-fraunces text-3xl text-charcoal font-semibold mb-2">
          You're all set! 🎉
        </h2>
        <p className="text-warm-gray text-sm max-w-md mx-auto">
          Review your profile overview below. You can update these preferences anytime from your settings.
        </p>
      </div>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream rounded-2xl border border-border p-6 shadow-sm space-y-6"
      >
        {/* CV Summary */}
        <div className="flex items-start justify-between p-4 rounded-xl bg-sand/60 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs text-warm-gray uppercase tracking-wider font-semibold">
                Uploaded Resume
              </p>
              <p className="text-sm font-semibold text-charcoal">
                {cvData?.fileName || "Resume_Parsed.pdf"}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-deep-green font-medium bg-deep-green/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} /> Parsed
          </span>
        </div>

        {/* Roles Summary */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-2 flex items-center gap-1.5">
            <Briefcase size={14} className="text-terracotta" /> Target Job Roles
          </span>
          <div className="flex flex-wrap gap-2">
            {preferences?.targetRoles?.length > 0 ? (
              preferences.targetRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-medium"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-xs text-warm-gray italic">No target roles specified</span>
            )}
          </div>
        </div>

        {/* Work Setup & Salary */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-terracotta" /> Work Setup
            </span>
            <p className="text-sm font-medium text-charcoal">
              {preferences?.workTypes?.length > 0
                ? preferences.workTypes.join(", ")
                : "Any Setup"}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-1 flex items-center gap-1.5">
              <DollarSign size={13} className="text-terracotta" /> Target Salary
            </span>
            <p className="text-sm font-medium text-charcoal">
              ${(preferences?.minSalary || 100000).toLocaleString()}+ / yr
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="pt-2 border-t border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-2">
            Skill Profile ({preferences?.skills?.length || 0})
          </span>
          <div className="flex flex-wrap gap-2">
            {preferences?.skills?.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md bg-sand border border-border text-xs text-charcoal font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </m.div>

      {/* Navigation CTA */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isFinishing}
          className="btn-secondary flex items-center gap-2 text-sm px-5 py-2.5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={handleFinish}
          disabled={isFinishing}
          className="btn-primary flex items-center gap-2 text-sm px-8 py-3 text-base font-semibold shadow-md"
        >
          {isFinishing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Launching Dashboard...
            </>
          ) : (
            <>
              <Rocket size={18} /> Launch My Job Search
            </>
          )}
        </button>
      </div>
    </div>
  );
}
