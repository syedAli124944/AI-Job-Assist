import { api } from "../lib/api";

export const DEFAULT_NOTIFICATION_SETTINGS = {
  emailJobRecommendations: true,
  emailApplicationUpdates: true,
  emailInterviewReminders: true,
  emailWeeklyDigest: false,
  inAppSoundAlerts: true,
  inAppToastNotifications: true,
  inAppBadgeCount: true,
  digestFrequency: "instant",
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const fetchUserStats = () =>
  api.get("/dashboard/stats").then(({ data }) => data);

// ─── Applications ─────────────────────────────────────────────────────────────
export const fetchApplications = () =>
  api.get("/applications").then(({ data }) => data);

/**
 * Apply to a job. Sends snake_case fields to match the FastAPI schema.
 */
export const applyToJob = (job) =>
  api
    .post("/applications", {
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      location: job.location,
      job_url: job.url,
    })
    .then(({ data }) => data);

/**
 * Update application status. URL: /applications/{id}/status
 */
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status }).then(({ data }) => data);

export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`).then(({ data }) => data);

export const hasUserApplied = async (jobId) => {
  const applications = await fetchApplications();
  return applications.some((application) => application.job_id === jobId);
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const fetchRecommendedJobs = (params = {}) =>
  api.get("/jobs", { params }).then(({ data }) => data);

export const fetchJob = (id) =>
  api.get(`/jobs/${id}`).then(({ data }) => data);

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = () =>
  api.get("/notifications").then(({ data }) => data);

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.post("/notifications/read-all");

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

// ─── Resume ───────────────────────────────────────────────────────────────────
export const uploadResumeApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(({ data }) => data);
};

// ─── Profile / Preferences ────────────────────────────────────────────────────
export const savePreferencesApi = (preferences) =>
  api.post("/profile/preferences", preferences).then(({ data }) => data);

export const fetchPreferences = () =>
  api.get("/profile/preferences").then(({ data }) => data);

// ─── AI Generation ────────────────────────────────────────────────────────────
export const generateCoverLetter = (job, resumeText) =>
  api
    .post("/ai/cover-letter", { job, resume_text: resumeText })
    .then(({ data }) => data.coverLetter);

export const generateJobSummary = (job) =>
  api
    .post("/ai/job-summary", { job })
    .then(({ data }) => data.summary);

export const generateEmail = (job, resumeText) =>
  api
    .post("/ai/email", { job, resume_text: resumeText })
    .then(({ data }) => data.email);

export const generateFollowUp = (job, applicationDate) =>
  api
    .post("/ai/followup", { job, application_date: applicationDate })
    .then(({ data }) => data.followUp);
