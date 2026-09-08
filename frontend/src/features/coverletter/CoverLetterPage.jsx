import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, CheckCircle, ArrowLeft, Copy, AlertCircle } from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";
import { applyToJob, generateCoverLetter, fetchJob } from "../../services/backendApi";

export default function CoverLetterPage() {
  const { jobId, "*": splatId } = useParams();
  const effectiveJobId = jobId || splatId || "";
  const location = useLocation();
  const navigate = useNavigate();

  // Use job passed via router state or fetch from backend API
  const [job, setJob] = useState(location.state?.job || null);
  const [loadingJob, setLoadingJob] = useState(!location.state?.job);
  const [jobError, setJobError] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);
  const [generating, setGenerating] = useState(true);
  const [applyError, setApplyError] = useState("");

  // Fetch job if not present in router state
  useEffect(() => {
    if (job) {
      setLoadingJob(false);
      return;
    }
    const cleanId = effectiveJobId ? decodeURIComponent(effectiveJobId) : "";
    if (!cleanId) {
      setLoadingJob(false);
      setJobError(true);
      return;
    }

    setLoadingJob(true);
    fetchJob(cleanId)
      .then((data) => {
        if (data && data.title) {
          setJob(data);
        } else {
          setJobError(true);
        }
      })
      .catch(() => setJobError(true))
      .finally(() => setLoadingJob(false));
  }, [effectiveJobId]);

  // Auto-generate cover letter whenever job is ready
  useEffect(() => {
    if (!job) return;
    setGenerating(true);
    generateCoverLetter(job, "")
      .then((text) => {
        if (text) setCoverLetter(text);
        else buildFallbackLetter(job);
      })
      .catch(() => buildFallbackLetter(job))
      .finally(() => setGenerating(false));
  }, [job?.id]);

  const buildFallbackLetter = (j = {}) => {
    const comp = j?.company || "Hiring Team";
    const title = j?.title || "advertised role";
    setCoverLetter(
      `Dear Hiring Manager at ${comp},\n\n` +
      `I am writing to express my strong interest in the ${title} position. With my background and relevant technical experience, I am confident in my ability to deliver immediate value to ${comp}.\n\n` +
      `I look forward to discussing how my skills align with your team's goals.\n\n` +
      `Sincerely,\n[Your Name]`
    );
  };

  const handleRegenerate = async () => {
    if (!job) return;
    setIsRegenerating(true);
    try {
      const text = await generateCoverLetter(job, "");
      if (text) setCoverLetter(text);
      else buildFallbackLetter(job);
    } catch {
      buildFallbackLetter(job);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async () => {
    if (!job) return;
    setApplyError("");
    try {
      await applyToJob(job);
      setApproved(true);
      setTimeout(() => navigate("/applications"), 1200);
    } catch (e) {
      const msg = e?.response?.data?.detail || "Failed to submit. You may have already applied.";
      setApplyError(msg);
    }
  };

  if (loadingJob) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-semibold text-charcoal">Loading job details...</p>
        </div>
      </DashboardLayout>
    );
  }

  // No job data found
  if (jobError || !job) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
          <AlertCircle size={40} className="mx-auto text-warm-gray/60" />
          <p className="text-base font-semibold text-charcoal">Job data not found</p>
          <p className="text-sm text-warm-gray">Please return to the Job Search page to select a job.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:underline"
          >
            <ArrowLeft size={14} /> Go to Job Search
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const applyUrl = job?.url || job?.apply_url;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to={`/jobs/${encodeURIComponent(job?.id || "")}`}
              state={{ job }}
              className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal font-semibold mb-2"
            >
              <ArrowLeft size={14} /> Back to Job Details
            </Link>
            <h1 className="font-fraunces text-3xl text-charcoal font-semibold tracking-tight">
              AI Cover Letter Editor
            </h1>
            <p className="text-warm-gray text-xs">
              Tailored for <span className="text-charcoal font-semibold">{job?.title}</span> at{" "}
              <span className="text-charcoal font-semibold">{job?.company}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating || generating}
              className="bg-sand hover:bg-border text-charcoal text-xs font-semibold px-4 py-2.5 rounded-xl border border-border flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} />
              {isRegenerating ? "Regenerating..." : "Regenerate AI Draft"}
            </button>
            <button
              onClick={handleApprove}
              disabled={approved || generating}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={15} />
              {approved ? "Approved & Saved!" : "Approve & Track"}
            </button>
          </div>
        </div>

        {applyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl">
            {applyError}
          </div>
        )}

        {/* Split View: Editor Left + Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editable Draft */}
          <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <Sparkles size={14} className="text-terracotta" /> AI Generated Draft (Editable)
              </span>
              <span className="text-xs font-mono text-warm-gray">
                {generating ? "Generating..." : `${coverLetter.split(/\s+/).filter(Boolean).length} words`}
              </span>
            </div>

            {generating ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-warm-gray font-medium">
                  Gemini AI is writing your tailored cover letter...
                </p>
              </div>
            ) : (
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={14}
                className="w-full bg-sand/40 border border-border rounded-xl p-4 text-xs font-sans text-charcoal leading-relaxed focus:outline-none focus:border-terracotta transition-colors resize-none"
              />
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray">
                  Formatted Document Preview
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-terracotta hover:text-terracotta-dark flex items-center gap-1"
                >
                  <Copy size={13} /> {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>

              <div className="bg-white border border-border/80 rounded-xl p-6 shadow-xs text-xs font-serif text-charcoal leading-relaxed whitespace-pre-line min-h-[280px]">
                {generating ? (
                  <span className="text-warm-gray/60 italic">AI is generating your cover letter...</span>
                ) : (
                  coverLetter
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-warm-gray">
              <span>Ready for submission</span>
              {applyUrl && (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta font-semibold hover:underline"
                >
                  Apply on {job.publisher || "Employer Site"} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
