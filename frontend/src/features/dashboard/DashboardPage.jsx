import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Sparkles, Plus } from "lucide-react";

import DashboardLayout from "./DashboardLayout";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import JobRecommendations from "./JobRecommendations";
import { getUserDisplayName } from "../../lib/mockAuth";

export default function DashboardPage() {
  const userName = getUserDisplayName();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl md:text-4xl text-charcoal font-semibold tracking-tight">
              Good morning, <span className="font-extrabold text-charcoal">{userName}</span> 👋
            </h1>
            <p className="text-warm-gray text-sm mt-1">
              Here is what's happening with your job search today.
            </p>
          </div>

          <Link
            to="/jobs"
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 shadow-sm"
          >
            <Search size={16} /> Explore New Jobs
          </Link>
        </div>

        {/* User Statistics Cards (Section 3 in diagram) */}
        <StatsCards />

        {/* Content Grid: Recent Activity + Recommended Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <JobRecommendations />
        </div>
      </div>
    </DashboardLayout>
  );
}
