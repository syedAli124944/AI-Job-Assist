import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, Award, Eye, CheckCheck, Clock, Settings, Trash2 } from "lucide-react";
import DashboardLayout from "../dashboard/DashboardLayout";
import NotificationSettingsModal from "../../components/shared/NotificationSettingsModal";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../lib/mockApi";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getUserNotifications());
    };
    window.addEventListener("notifications_updated", handleUpdate);
    return () => window.removeEventListener("notifications_updated", handleUpdate);
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleToggleRead = (id) => {
    markNotificationRead(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-fraunces text-3xl text-charcoal font-semibold tracking-tight">
              Notifications & Reminders
            </h1>
            <p className="text-warm-gray text-xs mt-1">
              Stay updated on interview schedules, application statuses, and follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-warm-gray bg-cream px-3 py-1.5 rounded-xl border border-border">
              {unreadCount} Unread
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-terracotta hover:text-terracotta-dark font-medium flex items-center gap-1 transition-colors"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="bg-cream hover:bg-sand border border-border text-charcoal px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Settings size={14} className="text-terracotta" /> Notification Settings
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-cream border border-border rounded-2xl p-6 shadow-sm space-y-4">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bell size={24} className="mx-auto text-warm-gray/60" />
              <p className="text-sm font-semibold text-charcoal">No notifications found</p>
              <p className="text-xs text-warm-gray">You are all caught up on your job application updates!</p>
            </div>
          ) : (
            notifications.map((item, idx) => {
              const isInterview = item.type === "interview";
              const isOffer = item.type === "offer";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleToggleRead(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                    !item.read
                      ? "bg-sand/60 border-terracotta/40 shadow-xs"
                      : "bg-cream/50 border-border/70 hover:bg-sand/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isInterview
                          ? "bg-blue-500/10 text-blue-600"
                          : isOffer
                          ? "bg-deep-green/10 text-deep-green"
                          : "bg-terracotta/10 text-terracotta"
                      }`}
                    >
                      {isInterview ? (
                        <Calendar size={18} />
                      ) : isOffer ? (
                        <Award size={18} />
                      ) : (
                        <Bell size={18} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-xs font-semibold text-charcoal">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-warm-gray">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono text-warm-gray whitespace-nowrap">
                      {item.time}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-warm-gray hover:text-red-600 transition-all"
                      title="Delete notification"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <NotificationSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </DashboardLayout>
  );
}
