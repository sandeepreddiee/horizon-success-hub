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

// API functions with mock data
export const authAPI = {
  login: async (username: string, password: string) => {
    // Mock login response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Check if username contains "advisor" to determine role
    if (username.toLowerCase().includes("advisor")) {
      return {
        data: {
          token: "mock-jwt-token-advisor",
          role: "ADVISOR" as "ADVISOR",
          studentId: null
        }
      };
    } else {
      return {
        data: {
          token: "mock-jwt-token-student",
          role: "STUDENT" as "STUDENT",
          studentId: 1
        }
      };
    }
  },
};

export const advisorAPI = {
  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        totalStudents: 156,
        highRiskStudents: 23,
        averageTermGpa: 3.24,
        averageAttendance: 87.5,
        studentRows: [
          { studentId: 1, name: "Emma Johnson", major: "Computer Science", riskTier: "High" as "High", riskScore: 75, termGpa: 2.1, attendancePct: 65 },
          { studentId: 2, name: "Michael Chen", major: "Business Administration", riskTier: "Medium" as "Medium", riskScore: 45, termGpa: 2.8, attendancePct: 78 },
          { studentId: 3, name: "Sarah Williams", major: "Engineering", riskTier: "Low" as "Low", riskScore: 15, termGpa: 3.6, attendancePct: 95 },
          { studentId: 4, name: "David Martinez", major: "Psychology", riskTier: "High" as "High", riskScore: 80, termGpa: 2.0, attendancePct: 60 },
          { studentId: 5, name: "Jessica Lee", major: "Biology", riskTier: "Low" as "Low", riskScore: 20, termGpa: 3.8, attendancePct: 92 },
        ]
      }
    };
  },
  getNotes: async (studentId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        notes: [
          { noteId: 1, content: "Student showed improvement in attendance this week. Encouraged to continue.", timestamp: "2024-11-15T10:30:00Z", advisorName: "Dr. Sarah Smith" },
          { noteId: 2, content: "Discussed study strategies for upcoming midterms. Student seems motivated.", timestamp: "2024-11-10T14:15:00Z", advisorName: "Dr. Sarah Smith" },
        ]
      }
    };
  },
  addNote: async (studentId: number, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        noteId: Date.now(),
        content,
        timestamp: new Date().toISOString(),
        advisorName: "Dr. Sarah Smith"
      }
    };
  },
};

export const studentAPI = {
  getDashboard: async (studentId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: {
        name: "Emma Johnson",
        major: "Computer Science",
        cumulativeGpa: 3.45,
        currentTermGpa: 3.2,
        attendancePct: 88,
        engagementScore: 75,
        riskTier: "Medium" as "Medium",
        courses: [
          { courseName: "Data Structures", credits: 4, grade: "B+" },
          { courseName: "Web Development", credits: 3, grade: "A-" },
          { courseName: "Database Systems", credits: 3, grade: "B" },
          { courseName: "Software Engineering", credits: 4, grade: "A" },
        ],
        gpaTrend: [
          { term: "Fall 2023", gpa: 3.2 },
          { term: "Spring 2024", gpa: 3.4 },
          { term: "Fall 2024", gpa: 3.5 },
        ],
        recommendations: [
          "Attend the Math Tutoring Center on Tuesdays and Thursdays",
          "Meet with your academic advisor to discuss course load",
          "Join a study group for Data Structures course",
          "Consider attending office hours for additional support",
        ]
      }
    };
  },
};
