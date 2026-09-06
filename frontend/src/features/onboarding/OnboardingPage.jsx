import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Upload, Sliders, Sparkles } from "lucide-react";

import StepCvUpload from "./StepCvUpload";
import StepPreferences from "./StepPreferences";
import StepReview from "./StepReview";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Onboarding State
  const [cvData, setCvData] = useState(null);

  const [preferences, setPreferences] = useState({
    targetRoles: ["Frontend Engineer", "Full Stack Developer"],
    workTypes: ["Remote", "Hybrid"],
    minSalary: 120000,
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "PostgreSQL"],
  });

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const stepVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: (dir) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    }),
  };

  const stepsList = [
    { number: 1, title: "Upload CV", icon: Upload },
    { number: 2, title: "Preferences", icon: Sliders },
    { number: 3, title: "Review", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-sand flex flex-col justify-between px-4 py-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-fraunces font-semibold text-charcoal text-lg">
            AI JobAssist
          </span>
        </Link>

        <span className="text-xs font-medium text-warm-gray bg-cream px-3 py-1.5 rounded-full border border-border">
          Step {step} of 3
        </span>
      </header>

      {/* Stepper Bar */}
      <div className="max-w-xl mx-auto w-full mb-10">
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-0" />
          <motion.div
            className="absolute top-1/2 left-0 h-0.5 bg-terracotta -translate-y-1/2 -z-0"
            initial={{ width: "0%" }}
            animate={{
              width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
            }}
            transition={{ duration: 0.4 }}
          />

          {stepsList.map((s) => {
            const isDone = step > s.number;
            const isCurrent = step === s.number;
            const Icon = s.icon;

            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (s.number < step) {
                      setDirection(-1);
                      setStep(s.number);
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isDone
                      ? "bg-terracotta text-white shadow-xs cursor-pointer"
                      : isCurrent
                      ? "bg-charcoal text-white ring-4 ring-terracotta/20 shadow-sm"
                      : "bg-cream text-warm-gray border border-border"
                  }`}
                >
                  {isDone ? <Check size={18} /> : <Icon size={16} />}
                </button>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? "text-charcoal font-semibold" : "text-warm-gray"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Content */}
      <main className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {step === 1 && (
              <StepCvUpload
                onNext={nextStep}
                cvData={cvData}
                setCvData={setCvData}
              />
            )}
            {step === 2 && (
              <StepPreferences
                onNext={nextStep}
                onBack={prevStep}
                preferences={preferences}
                setPreferences={setPreferences}
              />
            )}
            {step === 3 && (
              <StepReview
                onBack={prevStep}
                cvData={cvData}
                preferences={preferences}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer text */}
      <footer className="mt-12 text-center text-xs text-warm-gray">
        Need help? Contact support · AI JobAssist Onboarding
      </footer>
    </div>
  );
}
