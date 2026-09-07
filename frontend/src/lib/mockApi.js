/**
 * mockApi.js — Compatibility shim
 *
 * All components that import from "lib/mockApi" are transparently routed
 * to the real FastAPI backend via backendApi.js + localStorage helpers.
 *
 * Functions grouped by domain:
 *  - Stats
 *  - Applications (localStorage-backed for offline UX, synced with backend)
 *  - Notifications (backend-primary, localStorage fallback)
 *  - Notification Settings (localStorage)
 */

import {
  fetchUserStats,
  fetchApplications,
  applyToJob,
  updateApplicationStatus,
  deleteApplication,
  hasUserApplied,
  fetchNotifications,
  markNotificationRead as backendMarkRead,
  markAllNotificationsRead as backendMarkAllRead,
  deleteNotification as backendDeleteNotification,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "../services/backendApi";

// ─── Re-exports straight to backend ──────────────────────────────────────────
export {
  fetchUserStats,
  hasUserApplied,
  DEFAULT_NOTIFICATION_SETTINGS,
  fetchApplications,
  applyToJob,
  updateApplicationStatus,
  deleteApplication,
};

// ─── Applications — localStorage-backed kanban (synced from backend) ─────────

const APPS_KEY = "user_applications";

/**
 * Load applications.  Priority: backend → localStorage fallback.
 * The kanban tracker calls this synchronously, so we keep a localStorage
 * cache that is populated whenever the backend is reachable.
 */
export function getUserApplications() {
  try {
    const raw = localStorage.getItem(APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist the current kanban state to localStorage (used by tracker drag). */
export function saveUserApplications(apps) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  window.dispatchEvent(new Event("applications_updated"));
}

/**
 * Sync applications from the backend and update localStorage cache.
 * Call this on mount in pages that need fresh data.
 */
export async function syncApplicationsFromBackend() {
  try {
    const data = await fetchApplications();
    const normalised = data.map((a) => ({
      id: a.id,
      jobTitle: a.job_title,
      company: a.company,
      location: a.location || "",
      status: a.status,
      appliedAt: a.applied_at
        ? new Date(a.applied_at).toLocaleDateString()
        : "—",
      job_id: a.job_id,
      job_url: a.job_url,
    }));
    saveUserApplications(normalised);
    return normalised;
  } catch {
    return getUserApplications();
  }
}

/** Update an application's status in backend and localStorage. */
export async function updateApplicationStatusLocal(id, status) {
  try {
    await updateApplicationStatus(id, status);
  } catch {
    /* backend unavailable */
  }
  const apps = getUserApplications().map((a) =>
    a.id === id ? { ...a, status } : a
  );
  saveUserApplications(apps);
  return apps;
}

/** Delete an application from backend and localStorage. */
export async function deleteApplicationLocal(id) {
  try {
    await deleteApplication(id);
  } catch {
    /* backend unavailable */
  }
  const apps = getUserApplications().filter((a) => a.id !== id);
  saveUserApplications(apps);
  return apps;
}


// ─── Notifications — backend-primary, localStorage fallback ──────────────────

const NOTIF_KEY = "user_notifications";

function _cachedNotifications() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : _defaultNotifications();
  } catch {
    return _defaultNotifications();
  }
}

function _defaultNotifications() {
  return [
    {
      id: "n1",
      type: "match",
      title: "New job matches found",
      message: "3 new jobs match your profile. Check them out!",
      read: false,
      time: "2h ago",
    },
    {
      id: "n2",
      type: "interview",
      title: "Interview reminder",
      message: "You have an interview with TechCorp tomorrow at 10 AM.",
      read: false,
      time: "5h ago",
    },
    {
      id: "n3",
      type: "application",
      title: "Application status updated",
      message: "Your application to Acme Inc. moved to Interview stage.",
      read: true,
      time: "1d ago",
    },
  ];
}

/**
 * Returns notifications from localStorage (fast, synchronous).
 * Components should also call fetchNotifications() async to stay fresh.
 */
export function getUserNotifications() {
  return _cachedNotifications();
}

/** Mark a single notification read — backend call + local update. */
export async function markNotificationRead(id) {
  try {
    await backendMarkRead(id);
  } catch {
    /* backend unavailable — update locally only */
  }
  const updated = _cachedNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notifications_updated"));
  return updated;
}

/** Mark all notifications read — backend call + local update. */
export async function markAllNotificationsRead() {
  try {
    await backendMarkAllRead();
  } catch {
    /* backend unavailable */
  }
  const updated = _cachedNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notifications_updated"));
  return updated;
}

/** Delete a notification — backend call + local update. */
export async function deleteNotification(id) {
  try {
    await backendDeleteNotification(id);
  } catch {
    /* backend unavailable */
  }
  const updated = _cachedNotifications().filter((n) => n.id !== id);
  localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notifications_updated"));
  return updated;
}

/**
 * Sync notifications from backend into localStorage.
 */
export async function syncNotificationsFromBackend() {
  try {
    const data = await fetchNotifications();
    localStorage.setItem(NOTIF_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("notifications_updated"));
    return data;
  } catch {
    return _cachedNotifications();
  }
}

// ─── Notification Settings — localStorage only ───────────────────────────────

const SETTINGS_KEY = "notification_settings";

export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) }
      : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}
