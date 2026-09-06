import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, totalResults, onToggleFilterMobile }) {
  return (
    <div className="bg-cream border border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs by title, skill, or company (e.g. Frontend, Notion, React)..."
          className="w-full bg-sand/60 border border-border rounded-xl pl-11 pr-10 py-2.5 text-sm text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-terracotta transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Toggle Mobile Button */}
      <button
        onClick={onToggleFilterMobile}
        className="lg:hidden flex items-center justify-center gap-2 bg-sand hover:bg-border text-charcoal text-xs font-semibold px-4 py-2.5 rounded-xl border border-border w-full sm:w-auto"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      {/* Results Count Badge */}
      <div className="hidden sm:block text-xs font-medium text-warm-gray px-2 whitespace-nowrap font-mono">
        {totalResults} jobs found
      </div>
    </div>
  );
}
