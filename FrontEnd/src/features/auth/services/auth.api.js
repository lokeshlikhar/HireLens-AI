import api from "../../../services/api.js";

export const signup = async ({ username, email, password }) =>
  (await api.post("/api/auth/signup", { username, email, password })).data;
export const login = async ({ email, password }) =>
  (await api.post("/api/auth/login", { email, password })).data;
export const logout = async () => (await api.get("/api/auth/logout")).data;
export const getProfile = async () => (await api.get("/api/auth/profile")).data;
