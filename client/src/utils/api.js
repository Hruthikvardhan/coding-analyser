import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
});

// --- Analyse endpoints ---
export const analyseLeetCode = (username) =>
  api.post("/analyse/leetcode", { username });
export const analyseGitHub = (username) =>
  api.post("/analyse/github", { username });
export const analyseGfg = (username) => api.post("/analyse/gfg", { username });
export const analyseHackerRank = (username) =>
  api.post("/analyse/hackerrank", { username });
export const analyseAll = (usernames) => api.post("/analyse/all", usernames);

// --- Profile endpoints ---
export const saveProfile = (payload) => api.post("/profiles/save", payload);
export const getProfiles = () => api.get("/profiles");
export const getProfileById = (id) => api.get(`/profiles/${id}`);
export const deleteProfile = (id) => api.delete(`/profiles/${id}`);

// --- Stats endpoints ---
export const compareProfiles = (id1, id2) =>
  api.get("/stats/compare", { params: { id1, id2 } });
export const getLeaderboard = (limit = 20) =>
  api.get("/stats/leaderboard", { params: { limit } });

export default api;
