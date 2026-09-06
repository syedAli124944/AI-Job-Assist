import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #E8DBCC 0%, #EDE6DA 50%, #D6C9B4 100%)",
        }}
      />

      {/* Floating ambient shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 right-[10%] w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #B5654A, transparent)" }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[8%] w-48 h-48 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #3C5B42, transparent)" }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 text-center pt-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <span className="inline-block bg-terracotta/10 text-terracotta text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              AI-Powered Career Concierge
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-fraunces text-5xl md:text-6xl lg:text-7xl font-semibold text-charcoal leading-tight mb-6"
          >
            Find your next job,{" "}
            <span className="text-terracotta italic">effortlessly</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-warm-gray text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Upload your CV, get matched to top jobs, generate cover letters with AI, and track every application — all in one calm, powerful workspace.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding"
              className="bg-terracotta text-white font-medium px-8 py-3.5 rounded-xl hover:bg-terracotta-dark transition-all duration-200 hover:scale-105 shadow-sm text-base"
            >
              Get started — it's free
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-charcoal font-medium border border-border bg-cream/60 px-8 py-3.5 rounded-xl hover:bg-cream transition-colors text-base"
            >
              See how it works
            </a>
          </motion.div>

          {/* Trust signal */}
          <motion.p variants={itemVariants} className="text-warm-gray text-sm mt-8">
            Trusted by <span className="text-charcoal font-medium">5,000+</span> job seekers · No credit card required
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-warm-gray"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
