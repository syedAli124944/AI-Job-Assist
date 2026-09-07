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

export const fetchUserStats = () => api.get("/dashboard/stats").then(({ data }) => data);
export const fetchApplications = () => api.get("/applications").then(({ data }) => data);
export const fetchRecommendedJobs = (params = {}) => api.get("/jobs", { params }).then(({ data }) => data);
export const fetchJob = (id) => api.get(`/jobs/${id}`).then(({ data }) => data);

export const applyToJob = (job) =>
  api.post("/applications", {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    location: job.location,
    jobUrl: job.url,
  }).then(({ data }) => data);

export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}`, { status }).then(({ data }) => data);

export const hasUserApplied = async (jobId) => {
  const applications = await fetchApplications();
  return applications.some((application) => application.jobId === jobId);
};

export const fetchNotifications = () => api.get("/notifications").then(({ data }) => data);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.post("/notifications/read-all");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export const uploadResumeApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(({ data }) => data);
};

export const savePreferencesApi = (preferences) =>
  api.post("/profile/preferences", preferences).then(({ data }) => data);

export const generateCoverLetter = (job, resumeText) =>
  api.post("/ai/cover-letter", { job, resume_text: resumeText }).then(({ data }) => data.coverLetter);
