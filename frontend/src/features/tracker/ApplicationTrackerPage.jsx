import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Building2, ChevronRight, BookmarkCheck, Trash2 } from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";
import {
  getUserApplications,
  syncApplicationsFromBackend,
  updateApplicationStatusLocal,
  deleteApplicationLocal,
} from "../../lib/mockApi";

const COLUMNS = [
  { id: "Applied", title: "Applied", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: "Interview", title: "Interview", color: "bg-terracotta/10 text-terracotta border-terracotta/30" },
  { id: "Assessment", title: "Assessment", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { id: "Offer", title: "Offer", color: "bg-deep-green/10 text-deep-green border-green-200" },
  { id: "Rejected", title: "Rejected", color: "bg-warm-gray/10 text-warm-gray border-border" },
];

export default function ApplicationTrackerPage() {
  const [apps, setApps] = useState(() => getUserApplications());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    syncApplicationsFromBackend()
      .then((data) => {
        if (data) setApps(data);
      })
      .finally(() => setLoading(false));

    const handleUpdate = () => {
      setApps(getUserApplications());
    };
    window.addEventListener("applications_updated", handleUpdate);
    return () => window.removeEventListener("applications_updated", handleUpdate);
  }, []);

  const moveStatus = async (appId, nextStatus) => {
    await updateApplicationStatusLocal(appId, nextStatus);
  };

  const removeApp = async (appId) => {
    if (window.confirm("Remove this application from your tracker?")) {
      await deleteApplicationLocal(appId);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl md:text-4xl text-charcoal font-semibold tracking-tight">
              Application Tracker
            </h1>
            <p className="text-warm-gray text-sm mt-1">
              Kanban board for tracking job applications across stages.
            </p>
          </div>

          <span className="text-xs font-mono font-semibold text-warm-gray bg-cream px-3.5 py-2 rounded-xl border border-border">
            Total Applications: {apps.length}
          </span>
        </div>

        {/* Kanban Board Columns Grid (Section 7 in Diagram) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {COLUMNS.map((col) => {
            const columnApps = apps.filter((a) => a.status === col.id);

            return (
              <div key={col.id} className="bg-cream/80 border border-border rounded-2xl p-4 min-h-[400px] flex flex-col justify-between">
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${col.color}`}>
                      {col.title} ({columnApps.length})
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3">
                    {columnApps.map((app) => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-cream border border-border rounded-xl p-3.5 shadow-xs hover:shadow-sm transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-charcoal text-xs">
                            {app.jobTitle}
                          </h4>
                          <button
                            onClick={() => removeApp(app.id)}
                            className="text-warm-gray/60 hover:text-red-500 transition-colors p-0.5 rounded hover:bg-red-50"
                            title="Remove application"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-[11px] text-warm-gray flex items-center gap-1 font-medium">
                          <Building2 size={11} /> {app.company}
                        </p>
                        <span className="text-[10px] text-warm-gray font-mono block pt-1 border-t border-border/50">
                          Applied: {app.appliedAt}
                        </span>

                        {/* Move Status Buttons */}
                        <div className="pt-2 flex flex-wrap gap-1">
                          {COLUMNS.filter((c) => c.id !== app.status).map((targetCol) => (
                            <button
                              key={targetCol.id}
                              onClick={() => moveStatus(app.id, targetCol.id)}
                              className="text-[9px] font-semibold text-warm-gray hover:text-charcoal bg-sand px-1.5 py-0.5 rounded transition-colors"
                              title={`Move to ${targetCol.title}`}
                            >
                              → {targetCol.title}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}

                    {columnApps.length === 0 && (
                      <p className="text-xs text-warm-gray/60 italic text-center py-8">
                        No applications
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
