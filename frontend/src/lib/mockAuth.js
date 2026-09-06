// Mock authentication functions — no real backend needed
// Simulates JWT token login/register

const MOCK_USER = {
  id: "user-001",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  avatar: null,
};

const MOCK_TOKEN = "mock.jwt.token.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

export async function mockLogin({ email, password }) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 1200));

  // Simple mock check — any valid-looking email + password works
  if (!email || !password || password.length < 6) {
    throw new Error("Invalid credentials. Please try again.");
  }

  const user = { ...MOCK_USER, email };
  localStorage.setItem("auth_token", MOCK_TOKEN);
  localStorage.setItem("auth_user", JSON.stringify(user));
  return { user, token: MOCK_TOKEN };
}

export async function mockRegister({ name, email, password }) {
  await new Promise((res) => setTimeout(res, 1400));

  if (!email || !password || !name) {
    throw new Error("All fields are required.");
  }

  const user = { ...MOCK_USER, name, email };
  localStorage.setItem("auth_token", MOCK_TOKEN);
  localStorage.setItem("auth_user", JSON.stringify(user));
  return { user, token: MOCK_TOKEN };
}

export async function mockForgotPassword({ email }) {
  await new Promise((res) => setTimeout(res, 1000));
  if (!email) throw new Error("Email is required.");
  return { message: "Reset link sent" };
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
