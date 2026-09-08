import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, DollarSign, Clock, ArrowLeft, ArrowUpRight,
  Sparkles, Building2, CheckCircle2, AlertCircle
} from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";
import { fetchJob, fetchApplications } from "../../services/backendApi";

export default function JobDetailPage() {
  const { id, "*": splatId } = useParams();
  const effectiveId = id || splatId || "";
  const location = useLocation();

  // Use job passed via router state (from JobCard) — avoids needing a per-ID API
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!location.state?.job);
  const [error, setError] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Only fetch from API if we don't have router state
  useEffect(() => {
    if (job) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const cleanId = effectiveId ? decodeURIComponent(effectiveId) : "";
    fetchJob(cleanId)
      .then((data) => {
        if (data && data.title) {
          setJob(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [effectiveId]);

  // Check if this job is already applied
  useEffect(() => {
    fetchApplications()
      .then((apps) => {
        if (Array.isArray(apps)) {
          setIsApplied(apps.some((a) => String(a.job_id) === String(id)));
        }
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-semibold text-charcoal">Loading job details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
          <AlertCircle size={40} className="mx-auto text-warm-gray/60" />
          <p className="text-base font-semibold text-charcoal">Job not found</p>
          <p className="text-sm text-warm-gray">This job may have expired or been removed.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
          >
            <ArrowLeft size={14} /> Back to Job Search
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal font-semibold transition-colors"
        >
          <ArrowLeft size={14} /> Back to Job Search
        </Link>

        {/* Hero Card */}
        <div className="bg-cream border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-charcoal text-white font-bold flex items-center justify-center text-xl shadow-xs">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="font-fraunces text-2xl md:text-3xl font-semibold text-charcoal mb-1">
                  {job.title}
                </h1>
                <p className="text-sm font-medium text-warm-gray flex items-center gap-2">
                  <span>{job.company}</span> • <span>{job.location}</span>
                </p>
              </div>
            </div>

            {/* Match Score Ring */}
            <div className="flex items-center gap-4 bg-sand/60 p-4 rounded-2xl border border-border/80">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-border"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    className="text-deep-green"
                    strokeDasharray={`${job.matchScore ?? 0}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${job.matchScore ?? 0}, 100` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-charcoal font-mono">
                  {job.matchScore ?? 0}%
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-deep-green uppercase tracking-wider block">
                  AI Match Score
                </span>
                <span className="text-xs text-warm-gray">Based on your profile & resume</span>
              </div>
            </div>
          </div>

          {/* Quick Meta */}
          <div className="flex flex-wrap items-center gap-4 pt-6 text-xs font-medium text-charcoal">
            <span className="flex items-center gap-1.5 bg-sand px-3 py-1.5 rounded-xl">
              <DollarSign size={14} className="text-terracotta" /> {job.salary}
            </span>
            <span className="flex items-center gap-1.5 bg-sand px-3 py-1.5 rounded-xl">
              <MapPin size={14} className="text-terracotta" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5 bg-sand px-3 py-1.5 rounded-xl">
              <Clock size={14} className="text-terracotta" /> {job.type || "Full-time"}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-fraunces text-xl font-semibold text-charcoal">
                Job Description
              </h3>
              <p className="text-sm text-warm-gray leading-relaxed whitespace-pre-line">
                {job.description || "No description available."}
              </p>

              {job.requirements && job.requirements.length > 0 && (
                <>
                  <h4 className="font-semibold text-charcoal text-sm pt-4 border-t border-border">
                    Key Requirements
                  </h4>
                  <ul className="space-y-2 text-xs text-warm-gray">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-deep-green mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Apply CTA */}
          <div className="space-y-6">
            <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-fraunces text-lg font-semibold text-charcoal flex items-center gap-2">
                <Building2 size={18} className="text-terracotta" /> {job.company}
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                {job.about || `${job.company} is hiring for this role. Click "Apply with AI" to generate a tailored cover letter instantly.`}
              </p>
            </div>

            <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm text-center space-y-4">
              {isApplied ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-deep-green bg-deep-green/15 border border-deep-green/30 px-3.5 py-1.5 rounded-full">
                    <CheckCircle2 size={14} /> Already Applied
                  </span>
                  <p className="text-xs text-warm-gray leading-relaxed">
                    You have already submitted an application for this role.
                  </p>
                  <Link
                    to="/applications"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-3 px-4 bg-sand border border-border text-charcoal rounded-xl hover:bg-border transition-colors"
                  >
                    View in Application Tracker
                  </Link>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
                    <Sparkles size={13} /> AI Application Ready
                  </span>
                  <p className="text-xs text-warm-gray">
                    Generate a tailored cover letter from your resume and this job in seconds.
                  </p>
                  {/* Pass job via state so CoverLetterPage has it instantly */}
                  <Link
                    to={`/cover-letter/${encodeURIComponent(job.id)}`}
                    state={{ job }}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm py-3"
                  >
                    Apply & Generate Cover Letter <ArrowUpRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
