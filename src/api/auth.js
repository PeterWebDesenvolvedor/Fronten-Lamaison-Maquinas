import api, { setAccessToken } from "./axios";

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    // Backend sets the refresh token as an httpOnly cookie automatically.
    // The body only ever contains the short-lived access token + user.
    setAccessToken(data.accessToken);
    return data.user;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout"); // backend clears the httpOnly cookie
    } finally {
      setAccessToken(null);
    }
  },

  // Called on app boot to silently restore a session from the refresh cookie.
  refresh: async () => {
    const { data } = await api.post("/auth/refresh");
    setAccessToken(data.accessToken);
    return data.user;
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
