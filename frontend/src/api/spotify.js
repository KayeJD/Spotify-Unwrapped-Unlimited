const BASE = import.meta.env.VITE_API_BASE || "";

async function request(path) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // send session cookie with every request
  });

  if (res.status === 401) {
    const refreshed = await fetch(`${BASE}/auth/refresh`, { credentials: "include" });
    if (refreshed.ok) {
      const retry = await fetch(`${BASE}${path}`, { credentials: "include" });
      if (!retry.ok) throw new Error("Request failed after token refresh");
      return retry.json();
    }
    // Refresh also failed — force the user back to login
    window.location.href = "/";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}


export function checkAuthStatus() {
  return request("/auth/status");
}

// Not a fetch — just navigate the browser to the backend login redirect
export function loginWithSpotify() {
  window.location.href = `${BASE}/auth/login`;
}

export function logoutFromSpotify() {
  window.location.href = `${BASE}/auth/logout`;
}

export function getDashboard() {
  return request("/api/dashboard");
}

export function getRecommendations(artistId, trackId) {
  return request(`/api/recommendations?artist=${artistId}&track=${trackId}`);
}
