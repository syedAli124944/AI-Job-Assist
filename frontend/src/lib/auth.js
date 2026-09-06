import { api } from './api';

export async function login({ email, password }) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    
    // Save token
    localStorage.setItem('auth_token', access_token);
    
    // Fetch and save user profile
    const userResponse = await api.get('/auth/me');
    const user = userResponse.data;
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { user, token: access_token };
  } catch (error) {
    // Extract error message from FastAPI if it exists
    const message = error.response?.data?.detail || 'Login failed. Please try again.';
    throw new Error(message);
  }
}

export async function register({ email, password }) {
  try {
    // 1. Register the user
    await api.post('/auth/register', { email, password });
    
    // 2. Automatically log them in to get a token
    return await login({ email, password });
  } catch (error) {
    const message = error.response?.data?.detail || 'Registration failed. Please try again.';
    throw new Error(message);
  }
}

export async function forgotPassword({ email }) {
  // Not implemented on backend yet, simulating success
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
