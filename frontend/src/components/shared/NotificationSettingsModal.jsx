import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Mail, Volume2, ShieldCheck, Check, RotateCcw } from "lucide-react";
import { DEFAULT_NOTIFICATION_SETTINGS } from "../../services/backendApi";

const getNotificationSettings = () => {
  const stored = localStorage.getItem("notification_settings");
  if (stored) return JSON.parse(stored);
  return DEFAULT_NOTIFICATION_SETTINGS;
};

const saveNotificationSettings = (settings) => {
  localStorage.setItem("notification_settings", JSON.stringify(settings));
  window.dispatchEvent(new Event("notification_settings_updated"));
};

export default function NotificationSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    saveNotificationSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setSettings(DEFAULT_NOTIFICATION_SETTINGS);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-cream border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-border bg-sand/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-fraunces text-lg font-semibold text-charcoal">
                  Notification Settings
                </h3>
                <p className="text-xs text-warm-gray">
                  Customize how and when you receive job updates & alerts.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-warm-gray hover:text-charcoal hover:bg-sand/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Email Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-charcoal font-semibold border-b border-border/60 pb-1.5">
                <Mail size={15} className="text-terracotta" />
                <span>Email Notifications</span>
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">Job Recommendations</p>
                    <p className="text-warm-gray text-[11px]">Receive matches based on your resume and preferences.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailJobRecommendations}
                    onChange={() => handleToggle("emailJobRecommendations")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">Application Status Updates</p>
                    <p className="text-warm-gray text-[11px]">Get notified when applications move to Interview or Offer.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailApplicationUpdates}
                    onChange={() => handleToggle("emailApplicationUpdates")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">Interview Reminders</p>
                    <p className="text-warm-gray text-[11px]">Reminders for upcoming interviews and prep tasks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailInterviewReminders}
                    onChange={() => handleToggle("emailInterviewReminders")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">Weekly Career Digest</p>
                    <p className="text-warm-gray text-[11px]">Weekly report of applications and market salary trends.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailWeeklyDigest}
                    onChange={() => handleToggle("emailWeeklyDigest")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* In-App Alerts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-charcoal font-semibold border-b border-border/60 pb-1.5">
                <Volume2 size={15} className="text-terracotta" />
                <span>In-App & Popover Alerts</span>
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">In-App Notification Badge</p>
                    <p className="text-warm-gray text-[11px]">Show unread counter badge on the top-right bell icon.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.inAppBadgeCount}
                    onChange={() => handleToggle("inAppBadgeCount")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-sand/30 border border-border/60 cursor-pointer hover:bg-sand/50 transition-colors">
                  <div>
                    <p className="font-semibold text-charcoal">Real-time Activity Triggers</p>
                    <p className="text-warm-gray text-[11px]">Automatically record notifications when applying or uploading CV.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.inAppToastNotifications}
                    onChange={() => handleToggle("inAppToastNotifications")}
                    className="w-4 h-4 accent-terracotta rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Digest Frequency */}
            <div className="space-y-2">
              <label className="font-semibold text-charcoal block">Alert Frequency</label>
              <select
                value={settings.digestFrequency}
                onChange={(e) => setSettings({ ...settings, digestFrequency: e.target.value })}
                className="w-full bg-sand/40 border border-border rounded-xl p-2.5 text-xs text-charcoal outline-none focus:border-terracotta"
              >
                <option value="instant">Instant (Real-time updates as events happen)</option>
                <option value="daily">Daily Summary (Once a day at 9:00 AM)</option>
                <option value="weekly">Weekly Summary (Every Monday morning)</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-border bg-sand/30 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-warm-gray hover:text-charcoal font-medium flex items-center gap-1"
            >
              <RotateCcw size={13} /> Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-warm-gray hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check size={14} /> Saved!
                  </>
                ) : (
                  <>Save Preferences</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
