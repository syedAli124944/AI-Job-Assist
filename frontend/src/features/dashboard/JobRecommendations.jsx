import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, MapPin } from "lucide-react";
import { fetchRecommendedJobs } from "../../services/backendApi";


export default function JobRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    fetchRecommendedJobs()
      .then((data) => {
        if (isSubscribed && Array.isArray(data) && data.length > 0) {
          setJobs(data.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-terracotta" />
          <h3 className="font-fraunces text-xl font-semibold text-charcoal">
            Recommended Jobs
          </h3>
        </div>
        <Link
          to="/jobs"
          className="text-xs font-semibold text-terracotta hover:text-terracotta-dark transition-colors flex items-center gap-1"
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-warm-gray animate-pulse">
          Fetching live recommendations...
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className="p-4 rounded-xl bg-sand/50 border border-border/80 hover:bg-sand transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-charcoal text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {(job.company || "C").charAt(0)}
                </div>
                <div>
                  <Link
                    to={`/jobs/${job.id}`}
                    state={{ job }}
                    className="text-sm font-semibold text-charcoal group-hover:text-terracotta transition-colors block"
                  >
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-warm-gray mt-0.5">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={11} /> {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 bg-deep-green/15 text-deep-green px-2.5 py-1 rounded-full text-xs font-bold font-mono">
                  {job.matchScore ?? 85}% Match
                </span>
                <ChevronRight
                  size={16}
                  className="text-warm-gray group-hover:text-charcoal group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
