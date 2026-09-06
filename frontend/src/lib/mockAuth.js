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
    // Step 1: Register the user
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    // Step 2: Auto-login to get a JWT token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      throw new Error("Registered but could not log in automatically. Please sign in manually.");
    }

    const loginData = await loginResponse.json();
    localStorage.setItem("auth_token", loginData.access_token);

    // Step 3: Fetch user profile
    const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginData.access_token}` },
    });
    const user = await userResponse.json();
    localStorage.setItem("auth_user", JSON.stringify(user));

    return { user, token: loginData.access_token };
  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
}

export async function mockForgotPassword({ email }) {
  // Backend doesn't have this endpoint yet — simulate locally
  await new Promise((res) => setTimeout(res, 1000));
  if (!email) throw new Error("Email is required.");
  return { message: "Reset link sent" };
}

export function getUserDisplayName() {
  const user = getStoredUser();
  if (!user) {
    const localName = localStorage.getItem("user_name");
    return localName || "User";
  }
  return user.name || user.full_name || user.username || localStorage.getItem("user_name") || (user.email ? user.email.split("@")[0] : "User");
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
