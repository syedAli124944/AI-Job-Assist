import { SlidersHorizontal, RotateCcw, MapPin, Briefcase, DollarSign, Clock, Award } from "lucide-react";

export default function FilterPanel({ filters, setFilters, onReset }) {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-cream border border-border rounded-2xl p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-terracotta" />
          <h3 className="font-fraunces text-base font-semibold text-charcoal">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-terracotta hover:text-terracotta-dark font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> Clear All
        </button>
      </div>

      {/* 1. Location Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <MapPin size={13} className="text-terracotta" /> Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full bg-sand/60 border border-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
        >
          <option value="All">Select location (All)</option>
          <option value="Remote">Remote</option>
          <option value="San Francisco, CA">San Francisco, CA</option>
          <option value="New York, NY">New York, NY</option>
        </select>
      </div>

      {/* 2. Job Type Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <Briefcase size={13} className="text-terracotta" /> Job Type
        </label>
        <select
          value={filters.jobType}
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          className="w-full bg-sand/60 border border-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
        >
          <option value="All">Select job type (All)</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
        </select>
      </div>

      {/* 3. Salary Range Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <DollarSign size={13} className="text-terracotta" /> Minimum Salary
        </label>
        <select
          value={filters.salary}
          onChange={(e) => handleFilterChange("salary", e.target.value)}
          className="w-full bg-sand/60 border border-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
        >
          <option value="All">Select salary range (All)</option>
          <option value="100000">$100k+ / yr</option>
          <option value="140000">$140k+ / yr</option>
          <option value="160000">$160k+ / yr</option>
        </select>
      </div>

      {/* 4. Experience Level */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <Award size={13} className="text-terracotta" /> Experience
        </label>
        <select
          value={filters.experience}
          onChange={(e) => handleFilterChange("experience", e.target.value)}
          className="w-full bg-sand/60 border border-border rounded-xl px-3 py-2 text-xs font-medium text-charcoal focus:outline-none focus:border-terracotta"
        >
          <option value="All">All Levels</option>
          <option value="2+ years">2+ years</option>
          <option value="3+ years">3+ years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </div>

      {/* 5. Remote / On-site */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
          <Clock size={13} className="text-terracotta" /> Remote / Setup
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["All", "Remote", "On-site", "Hybrid"].map((setup) => {
            const active = filters.setup === setup;
            return (
              <button
                key={setup}
                type="button"
                onClick={() => handleFilterChange("setup", setup)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  active
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-sand/40 text-charcoal border-border hover:bg-sand"
                }`}
              >
                {setup}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
