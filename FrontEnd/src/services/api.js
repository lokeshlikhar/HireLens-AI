import axios from "axios";

const api = axios.create({
  baseURL: "https://hirelens-ai-le8c.onrender.com",
  withCredentials: true,
  timeout: 60000,
});

export default api;
