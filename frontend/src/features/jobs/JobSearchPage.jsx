import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import JobList from "./JobList";
import { fetchRecommendedJobs, fetchApplications } from "../../services/backendApi";

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liveJobs, setLiveJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    location: "All",
    jobType: "All",
    salary: "All",
    experience: "All",
    setup: "All",
  });

  // Fetch real applications from backend for accurate 'Applied' status
  useEffect(() => {
    fetchApplications()
      .then((apps) => {
        if (Array.isArray(apps)) {
          const ids = new Set(apps.map((a) => String(a.job_id)));
          setAppliedJobIds(ids);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch real live jobs from Adzuna API whenever searchQuery or location filter changes
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    const params = {};
    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }
    if (filters.location !== "All") {
      params.location = filters.location;
    }

    fetchRecommendedJobs(params)
      .then((data) => {
        if (isSubscribed) {
          if (Array.isArray(data)) {
            setLiveJobs(data);
          } else {
            setLiveJobs([]);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setLiveJobs([]);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [searchQuery, filters.location]);

  const handleResetFilters = () => {
    setFilters({
      location: "All",
      jobType: "All",
      salary: "All",
      experience: "All",
      setup: "All",
    });
    setSearchQuery("");
  };

  // Client-side filter logic
  const filteredJobs = useMemo(() => {
    return liveJobs.filter((job) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(query);
        const matchesCompany = job.company?.toLowerCase().includes(query);
        const matchesDesc = job.description?.toLowerCase().includes(query);
        const matchesTags = job.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesTags) return false;
      }

      // Location filter
      if (filters.location !== "All" && job.location !== filters.location) {
        return false;
      }

      // Job type filter
      if (filters.jobType !== "All" && job.type !== filters.jobType) {
        return false;
      }

      // Experience filter
      if (filters.experience !== "All" && job.experience !== filters.experience) {
        return false;
      }

      // Remote / Setup filter
      if (filters.setup !== "All") {
        if (filters.setup === "Remote" && job.location !== "Remote") return false;
        if (filters.setup === "On-site" && job.location === "Remote") return false;
      }

      return true;
    });
  }, [liveJobs, searchQuery, filters]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-fraunces text-3xl md:text-4xl text-charcoal font-semibold tracking-tight">
            Find Matches & Jobs
          </h1>
          <p className="text-warm-gray text-sm mt-1">
            Live fetching real company openings matching your search criteria.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalResults={filteredJobs.length}
          onToggleFilterMobile={() => setMobileFilterOpen((v) => !v)}
        />

        {/* 2-Column Grid: Filter Panel (Left) + Job List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Collapsible */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-1">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Job Results List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="p-12 text-center bg-cream rounded-2xl border border-border">
                <div className="inline-block w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-semibold text-charcoal">Live fetching real jobs from Adzuna API...</p>
              </div>
            ) : (
              <JobList jobs={filteredJobs} appliedJobIds={appliedJobIds} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
