import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Users, Award, UserCheck } from "lucide-react";
import { fetchUserStats } from "../../services/backendApi";

export default function StatsCards({ stats: propStats }) {
  const [liveStats, setLiveStats] = useState({
    applied: 12,
    interviews: 3,
    offers: 2,
    profileCompletion: 85,
    ...propStats,
  });

  useEffect(() => {
    fetchUserStats().then((data) => {
      if (data) setLiveStats((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const defaultStats = liveStats;

  const cards = [
    {
      title: "Applications",
      value: defaultStats.applied,
      suffix: "",
      icon: Send,
      bgColor: "bg-terracotta/10",
      textColor: "text-terracotta",
    },
    {
      title: "Interviews",
      value: defaultStats.interviews,
      suffix: "",
      icon: Users,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600",
    },
    {
      title: "Offers",
      value: defaultStats.offers,
      suffix: "",
      icon: Award,
      bgColor: "bg-deep-green/10",
      textColor: "text-deep-green",
    },
    {
      title: "Profile Completion",
      value: defaultStats.profileCompletion,
      suffix: "%",
      icon: UserCheck,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
            className="bg-cream border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.3 }}
                className="font-fraunces text-3xl font-semibold text-charcoal"
              >
                {card.value}
              </motion.span>
              <span className="font-fraunces text-xl text-charcoal">{card.suffix}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
