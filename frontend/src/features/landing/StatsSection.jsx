import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Jobs matched" },
  { value: 5000, suffix: "+", label: "Active users" },
  { value: 95, suffix: "%", label: "Match accuracy" },
  { value: 3, suffix: "x", label: "Faster job search" },
];

function CountUp({ to, suffix, inView }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (to / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setDisplay(to);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="stats" className="py-24 px-6 bg-charcoal" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-white/50 text-xs font-semibold tracking-widest uppercase mb-14"
        >
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-fraunces text-4xl md:text-5xl font-semibold text-white mb-2">
                <CountUp to={s.value} suffix={s.suffix} inView={inView} />
              </div>
              <p className="text-white/50 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
