import { motion } from "framer-motion";
import { Clock, CheckCircle2, Calendar, FileText, Send } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      id: "act-1",
      title: "Applied to Frontend Developer",
      company: "Acme Inc.",
      time: "2h ago",
      icon: Send,
      badgeBg: "bg-terracotta/10",
      badgeColor: "text-terracotta",
    },
    {
      id: "act-2",
      title: "Interview scheduled",
      company: "TechCorp",
      time: "1d ago",
      icon: Calendar,
      badgeBg: "bg-blue-500/10",
      badgeColor: "text-blue-600",
    },
    {
      id: "act-3",
      title: "Cover letter approved",
      company: "Data Analyst role",
      time: "2d ago",
      icon: FileText,
      badgeBg: "bg-deep-green/10",
      badgeColor: "text-deep-green",
    },
  ];

  return (
    <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-fraunces text-xl font-semibold text-charcoal">
          Recent Activity
        </h3>
        <span className="text-xs text-warm-gray flex items-center gap-1">
          <Clock size={13} /> Updated live
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((act, idx) => {
          const Icon = act.icon;

          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="flex items-start justify-between pb-3 border-b border-border/60 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl ${act.badgeBg} ${act.badgeColor} flex items-center justify-center mt-0.5`}>
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-charcoal">{act.title}</p>
                  <p className="text-xs text-warm-gray font-medium">{act.company}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-warm-gray">{act.time}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
