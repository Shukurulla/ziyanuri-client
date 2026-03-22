import axios from "axios";
import i18n from "./i18n";

const api = axios.create({
  baseURL: "http://127.0.0.1:7294/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.params) config.params = {};
  if (!config.params.lang) config.params.lang = i18n.language;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
