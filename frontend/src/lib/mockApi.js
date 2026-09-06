import { api } from "./api";
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_NOTIFICATIONS, MOCK_USER } from "./mockData";

export function getUserApplications() {
  try {
    const stored = localStorage.getItem("user_applications");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with MOCK_APPLICATIONS avoiding duplicates by id
      const storedIds = new Set(parsed.map((a) => a.id));
      const combined = [...parsed];
      for (const item of MOCK_APPLICATIONS) {
        if (!storedIds.has(item.id) && !combined.some(c => c.company?.toLowerCase() === item.company?.toLowerCase() && c.jobTitle?.toLowerCase() === item.jobTitle?.toLowerCase())) {
          combined.push(item);
        }
      }
      return combined;
    }
  } catch {
    // fallback
  }
  return MOCK_APPLICATIONS;
}

export function saveUserApplications(apps) {
  try {
    localStorage.setItem("user_applications", JSON.stringify(apps));
    window.dispatchEvent(new Event("applications_updated"));
  } catch {
    // ignore
  }
}

export function hasUserApplied(jobId, company, title) {
  const apps = getUserApplications();
  return apps.some(
    (a) =>
      a.jobId === jobId ||
      a.id === jobId ||
      (company && title && a.company?.toLowerCase() === company.toLowerCase() && a.jobTitle?.toLowerCase() === title.toLowerCase())
  );
}

export function applyToJob(job) {
  const apps = getUserApplications();
  const already = hasUserApplied(job.id, job.company, job.title);
  if (already) {
    return { success: false, message: "Already applied to this job." };
  }

  const newApp = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    status: "Applied",
    appliedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    logo: job.logo || null,
  };

  const updated = [newApp, ...apps];
  saveUserApplications(updated);
  return { success: true, application: newApp };
}

export async function fetchUserStats() {
  const apps = getUserApplications();
  const appliedCount = apps.filter((a) => a.status === "Applied").length;
  const interviewCount = apps.filter((a) => a.status === "Interview").length;
  const offerCount = apps.filter((a) => a.status === "Offer").length;
  const hasResume = !!localStorage.getItem("user_resume");

  return {
    applied: appliedCount,
    interviews: interviewCount,
    offers: offerCount,
    profileCompletion: hasResume ? 95 : 85,
  };
}

export async function fetchApplications() {
  return getUserApplications();
}

export async function fetchRecommendedJobs() {
  try {
    const res = await api.get("/jobs");
    if (res.data) return res.data;
  } catch {
    // Fallback recommendations
  }
  return MOCK_JOBS;
}

export async function uploadResumeApi(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data) {
      localStorage.setItem("user_resume", JSON.stringify(res.data));
      return res.data;
    }
  } catch {
    // Fallback simulation
  }

  const parsedResume = {
    fileName: file.name,
    fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    suggestedTitle: "Senior Frontend Engineer",
    extractedEmail: "alex@example.com",
    parsedSkills: ["React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs", "GraphQL"],
    experienceSummary: "5+ years of experience in modern frontend development and web architecture.",
  };

  localStorage.setItem("user_resume", JSON.stringify(parsedResume));
  return parsedResume;
}

export async function savePreferencesApi(preferences) {
  try {
    const res = await api.post("/profile/preferences", preferences);
    if (res.data) {
      localStorage.setItem("user_preferences", JSON.stringify(preferences));
      localStorage.setItem("onboarding_complete", "true");
      return res.data;
    }
  } catch {
    // Fallback simulation
  }

  localStorage.setItem("user_preferences", JSON.stringify(preferences));
  localStorage.setItem("onboarding_complete", "true");

  return {
    success: true,
    message: "Preferences updated successfully",
    preferences,
    profileCompletion: 95,
  };
}
