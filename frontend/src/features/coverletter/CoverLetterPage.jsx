import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, CheckCircle, ArrowLeft, Copy } from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";
import { MOCK_JOBS } from "../../lib/mockData";
import { getUserDisplayName } from "../../lib/mockAuth";
import { applyToJob } from "../../lib/mockApi";

export default function CoverLetterPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
  const userName = getUserDisplayName();

  const defaultDraft = `Dear Hiring Manager at ${job.company},

I am excited to submit my application for the ${job.title} position. With over 5 years of experience building modern, responsive, and performant web applications using React, TypeScript, and Tailwind CSS, I am confident in my ability to make an immediate impact on your team.

Throughout my career, I have focused on translating design visions into clean, maintainable code while maintaining a high bar for accessible user experience. Your work at ${job.company} aligns closely with my passion for creating intuitive tools.

Thank you for your time and consideration. I look forward to discussing how my experience fits your team's goals.

Sincerely,
${userName}`;

  const [coverLetter, setCoverLetter] = useState(defaultDraft);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setCoverLetter(
        `Dear ${job.company} Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${job.title} role. Having reviewed your requirements for ${job.requirements?.[0] || "React expertise"}, I am confident that my background in frontend engineering and UI architecture makes me an ideal fit.\n\nAt my previous roles, I led frontend initiatives, optimized web performance, and collaborated closely with cross-functional teams. I admire ${job.company}'s mission and would welcome the chance to contribute.\n\nBest regards,\n${userName}`
      );
      setIsRegenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = () => {
    applyToJob(job);
    setApproved(true);
    setTimeout(() => {
      navigate("/applications");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-charcoal font-semibold mb-2"
            >
              <ArrowLeft size={14} /> Back to Job Details
            </Link>
            <h1 className="font-fraunces text-3xl text-charcoal font-semibold tracking-tight">
              AI Cover Letter Editor
            </h1>
            <p className="text-warm-gray text-xs">
              Tailored for <span className="text-charcoal font-semibold">{job.title}</span> at{" "}
              <span className="text-charcoal font-semibold">{job.company}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="bg-sand hover:bg-border text-charcoal text-xs font-semibold px-4 py-2.5 rounded-xl border border-border flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} />
              {isRegenerating ? "Regenerating..." : "Regenerate AI Draft"}
            </button>
            <button
              onClick={handleApprove}
              disabled={approved}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <CheckCircle size={15} />
              {approved ? "Approved & Saved!" : "Approve & Track"}
            </button>
          </div>
        </div>

        {/* Split View: Editor Left + Preview Right (Section 6 in Diagram) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Editable Draft Textarea */}
          <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <Sparkles size={14} className="text-terracotta" /> AI Generated Draft (Editable)
              </span>
              <span className="text-xs font-mono text-warm-gray">
                {coverLetter.split(/\s+/).length} words
              </span>
            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={14}
              className="w-full bg-sand/40 border border-border rounded-xl p-4 text-xs font-sans text-charcoal leading-relaxed focus:outline-none focus:border-terracotta transition-colors resize-none"
            />
          </div>

          {/* Right: Live Formatted Document Preview */}
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
                {coverLetter}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-warm-gray">
              <span>Ready for submission</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
