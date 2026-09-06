import { useState, useMemo } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import JobList from "./JobList";
import { MOCK_JOBS } from "../../lib/mockData";

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: "All",
    jobType: "All",
    salary: "All",
    experience: "All",
    setup: "All",
  });

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

  // Filter logic
  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesTags = job.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesTags) return false;
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
  }, [searchQuery, filters]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-fraunces text-3xl md:text-4xl text-charcoal font-semibold tracking-tight">
            Find Matches & Jobs
          </h1>
          <p className="text-warm-gray text-sm mt-1">
            Discover roles tailored to your resume experience and target career preferences.
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
            <JobList jobs={filteredJobs} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
