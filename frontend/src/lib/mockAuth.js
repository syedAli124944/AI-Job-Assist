// Real authentication with backend API

const API_BASE_URL = "http://localhost:8000";

export async function mockLogin({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Invalid credentials. Please try again.");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.access_token);
    
    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const user = await userResponse.json();
    localStorage.setItem("auth_user", JSON.stringify(user));
    
    return { user, token: data.access_token };
  } catch (err) {
    throw new Error(err.message || "Login failed");
  }
}

export async function mockRegister({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    const user = await response.json();
    localStorage.setItem("auth_user", JSON.stringify(user));
    
    return { user, token: null };
  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
}

export async function mockForgotPassword({ email }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to send reset link");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err.message || "Forgot password failed");
  }
}

export function getStoredUser() {
  try {
    const user = localStorage.getItem("auth_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("auth_token");
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}
