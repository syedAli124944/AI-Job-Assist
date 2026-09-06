import { useState } from "react";
import JobCard from "./JobCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobList({ jobs }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-cream border border-border rounded-2xl p-12 text-center">
        <p className="text-charcoal font-semibold text-base mb-1">No matching jobs found</p>
        <p className="text-warm-gray text-xs">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls matching diagram Section 4 */}
      <div className="flex items-center justify-between bg-cream border border-border rounded-2xl px-6 py-4 shadow-sm">
        <span className="text-xs font-mono font-semibold text-warm-gray">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-xl border border-border text-charcoal hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-xl border border-border text-charcoal hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
