// utils/auth.js
let logoutTimer;

export function saveAuthData(token, user) {
  const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
  const expiry = payload.exp * 1000; // convert to ms

  localStorage.setItem("token", token);
  localStorage.setItem("role", user.role);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("expiry", expiry);

  // Clear old timers
  if (logoutTimer) clearTimeout(logoutTimer);

  // Schedule auto logout
  const remainingTime = expiry - Date.now();
  logoutTimer = setTimeout(() => {
    clearAuthData();
    window.location.href = "/login"; // redirect to login
  }, remainingTime);
}

export function getAuthData() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const expiry = localStorage.getItem("expiry");

  if (!token || !expiry) return null;

  // auto logout if expired
  if (Date.now() > expiry) {
    clearAuthData();
    return null;
  }

  return { token, user };
}

export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("expiry");

  if (logoutTimer) clearTimeout(logoutTimer);
}
