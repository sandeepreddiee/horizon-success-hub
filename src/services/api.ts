import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("studentId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// API functions
export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
};

export const advisorAPI = {
  getDashboard: () => api.get("/dashboard/advisor"),
  getNotesPage: (studentId: number, termId: number) =>
    api.get(`/notes/advisor-page/${studentId}/${termId}`),
  addNote: (studentId: number, termId: number, type: string) =>
    api.post("/notes", { studentId, termId, type }),
};

export const studentAPI = {
  getDashboard: (studentId: number) => api.get(`/student/${studentId}/dashboard`),
};
