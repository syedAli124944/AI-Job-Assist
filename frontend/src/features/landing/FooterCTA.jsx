import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FooterCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 px-6 bg-sand" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-cream rounded-3xl border border-border p-12 md:p-16 text-center shadow-sm"
        >
          <span className="text-terracotta text-xs font-semibold tracking-widest uppercase">Start today</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-semibold text-charcoal mt-4 mb-5">
            Ready to land your dream job?
          </h2>
          <p className="text-warm-gray text-lg mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who are already using AI to work smarter, apply faster, and land better roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding"
              className="flex items-center gap-2 bg-terracotta text-white font-medium px-8 py-3.5 rounded-xl hover:bg-terracotta-dark transition-all duration-200 hover:scale-105 shadow-sm text-base"
            >
              Get started for free
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/auth/login"
              className="text-charcoal font-medium border border-border px-8 py-3.5 rounded-xl hover:bg-sand transition-colors text-base"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
