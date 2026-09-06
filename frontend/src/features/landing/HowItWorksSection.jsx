import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, SlidersHorizontal, Zap, Send } from "lucide-react";

const steps = [
  { icon: Upload, number: "01", title: "Upload your CV", description: "Drag and drop your resume. Our AI parses it instantly and builds your profile." },
  { icon: SlidersHorizontal, number: "02", title: "Set preferences", description: "Tell us your ideal role, location, salary range, and work style." },
  { icon: Zap, number: "03", title: "Get matched", description: "Receive a curated list of jobs ranked by how well they fit your profile." },
  { icon: Send, number: "04", title: "Apply with confidence", description: "Generate a tailored cover letter and apply in one click." },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-28 px-6 bg-cream" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="text-terracotta text-xs font-semibold tracking-widest uppercase">How it works</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-charcoal mt-3">
            Four steps to your next role
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border z-0" />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-terracotta z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="w-20 h-20 bg-sand rounded-full border-2 border-border flex items-center justify-center mb-6 relative">
                  <step.icon size={24} className="text-terracotta" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-terracotta text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-charcoal text-base mb-2">{step.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
