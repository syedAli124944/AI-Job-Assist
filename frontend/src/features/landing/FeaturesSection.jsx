import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Target, FileText, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart job matching",
    description: "Our AI analyzes your CV against thousands of roles to surface the jobs where you'll genuinely stand out.",
  },
  {
    icon: FileText,
    title: "AI cover letters",
    description: "Generate tailored cover letters in seconds. Edit, refine, and approve — your voice, amplified.",
  },
  {
    icon: BarChart3,
    title: "Application tracker",
    description: "A beautiful kanban board to track every application from first click to final offer.",
  },
  {
    icon: Sparkles,
    title: "Smart reminders",
    description: "Never miss a follow-up or interview. Get timely nudges that keep your job search moving forward.",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-28 px-6 bg-sand" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-terracotta text-xs font-semibold tracking-widest uppercase">Why JobAssist</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-charcoal mt-3">
            Everything your job search needs
          </h2>
          <p className="text-warm-gray mt-4 text-lg max-w-xl mx-auto">
            From discovery to offer — we've built the tools so you can focus on what matters: landing the role.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              className="bg-cream rounded-2xl p-7 border border-border"
            >
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center mb-5">
                <f.icon size={20} className="text-terracotta" />
              </div>
              <h3 className="font-semibold text-charcoal text-base mb-2">{f.title}</h3>
              <p className="text-warm-gray text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
