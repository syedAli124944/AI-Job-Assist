import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Award, Eye, CheckCheck, ChevronRight, Settings } from "lucide-react";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationSettings,
} from "../../lib/mockApi";
import NotificationSettingsModal from "./NotificationSettingsModal";

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getUserNotifications());
  const [notifSettings, setNotifSettings] = useState(() => getNotificationSettings());
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getUserNotifications());
      setNotifSettings(getNotificationSettings());
    };
    window.addEventListener("notifications_updated", handleUpdate);
    window.addEventListener("notification_settings_updated", handleUpdate);
    return () => {
      window.removeEventListener("notifications_updated", handleUpdate);
      window.removeEventListener("notification_settings_updated", handleUpdate);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllNotificationsRead();
  };

  const handleNotifClick = (id) => {
    markNotificationRead(id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative inline-block" ref={popoverRef}>
        {/* Sticky Bell Icon Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications and Reminders"
          className="relative w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-charcoal hover:text-terracotta hover:border-terracotta/40 shadow-sm transition-all duration-200"
        >
          <Bell size={18} />
          {notifSettings.inAppBadgeCount && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta text-white text-[10px] font-bold flex items-center justify-center border-2 border-sand shadow-xs font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Floating Popover Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-cream border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {/* Popover Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-sand/40">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-terracotta" />
                  <h4 className="font-fraunces text-sm font-semibold text-charcoal">
                    Notifications & Reminders
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-medium text-terracotta hover:text-terracotta-dark flex items-center gap-1"
                      title="Mark all read"
                    >
                      <CheckCheck size={12} /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="p-1 rounded-lg text-warm-gray hover:text-charcoal hover:bg-sand/60 transition-colors"
                    title="Notification Settings"
                  >
                    <Settings size={14} />
                  </button>
                </div>
              </div>

              {/* Quick List Items */}
              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-warm-gray italic text-center py-6">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotifClick(item.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                        !item.read
                          ? "bg-sand/60 border border-terracotta/20 font-medium"
                          : "hover:bg-sand/40 text-warm-gray"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === "interview"
                            ? "bg-blue-500/10 text-blue-600"
                            : item.type === "offer"
                            ? "bg-deep-green/10 text-deep-green"
                            : "bg-terracotta/10 text-terracotta"
                        }`}
                      >
                        {item.type === "interview" ? (
                          <Calendar size={14} />
                        ) : item.type === "offer" ? (
                          <Award size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-charcoal truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] font-mono text-warm-gray">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-warm-gray leading-tight line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer Link */}
              <div className="p-3 border-t border-border bg-sand/30 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="text-warm-gray hover:text-charcoal flex items-center gap-1 font-medium text-[11px]"
                >
                  <Settings size={12} /> Settings
                </button>
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="font-semibold text-terracotta hover:text-terracotta-dark inline-flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight size={13} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <NotificationSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
