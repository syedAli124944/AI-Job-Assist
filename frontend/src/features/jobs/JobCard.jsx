import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, DollarSign, Clock, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function JobCard({ job, isApplied = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-cream border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
    >
      <div>
        {/* Top bar: Company & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-charcoal text-white font-bold flex items-center justify-center text-base shadow-xs">
              {job.company.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-charcoal text-xs tracking-wide uppercase">
                {job.company}
              </h4>
              <p className="text-xs text-warm-gray">{job.postedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isApplied ? (
              <span className="bg-deep-green/15 text-deep-green border border-deep-green/30 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 size={12} /> Applied
              </span>
            ) : (
              <span className="bg-terracotta/10 text-terracotta text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                New
              </span>
            )}
            <span className="bg-deep-green/15 text-deep-green px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1">
              <Sparkles size={11} /> {job.matchScore ?? 0}%
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="font-fraunces text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors mb-3">
          {job.title}
        </h3>

        {/* Job Details Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-warm-gray mb-4">
          <span className="flex items-center gap-1 font-medium text-charcoal bg-sand/60 px-2.5 py-1 rounded-lg">
            <MapPin size={12} className="text-terracotta" /> {job.location}
          </span>
          <span className="flex items-center gap-1 font-medium text-charcoal bg-sand/60 px-2.5 py-1 rounded-lg font-mono">
            <DollarSign size={12} className="text-terracotta" /> {job.salary}
          </span>
          <span className="flex items-center gap-1 font-medium text-warm-gray bg-sand/60 px-2.5 py-1 rounded-lg">
            <Clock size={12} /> {job.type || job.experience}
          </span>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-charcoal bg-cream border border-border px-2.5 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-border flex items-center justify-between">
        {/* Pass full job object via router state — avoids needing a /jobs/:id API */}
        <Link
          to={`/jobs/${encodeURIComponent(job.id)}`}
          state={{ job }}
          className="text-xs font-semibold text-warm-gray hover:text-charcoal transition-colors"
        >
          View Details
        </Link>

        {isApplied ? (
          <span className="bg-deep-green/15 text-deep-green border border-deep-green/30 text-xs font-semibold px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
            <CheckCircle2 size={13} /> Already Applied
          </span>
        ) : (
          <Link
            to={`/cover-letter/${encodeURIComponent(job.id)}`}
            state={{ job }}
            className="btn-primary inline-flex items-center gap-1 text-xs px-4 py-2"
          >
            Apply with AI <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
