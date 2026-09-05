import axios from "axios";

// In Docker, VITE_API_URL is injected via docker-compose; falls back to
// localhost for running the frontend outside Docker during dev.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL });

export default api;
