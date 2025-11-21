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
  login: async (username: string, password: string, requestedRole?: "ADVISOR" | "STUDENT") => {
    // Mock login response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Use requested role if provided, otherwise determine from username
    if (requestedRole === "ADVISOR") {
      return {
        data: {
          token: "mock-jwt-token-advisor",
          role: "ADVISOR" as "ADVISOR",
          studentId: null
        }
      };
    } else if (requestedRole === "STUDENT") {
      return {
        data: {
          token: "mock-jwt-token-student",
          role: "STUDENT" as "STUDENT",
          studentId: 1
        }
      };
    }
    
    // Fallback to checking username if no role specified
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
        totalStudents: 124,
        highRiskStudents: 18,
        averageTermGpa: 3.15,
        averageAttendance: 86,
        studentRows: [
          { studentId: 1, name: "Aarav Patel", major: "Computer Science", riskTier: "High" as "High", riskScore: 88, termGpa: 2.80, attendancePct: 75 },
          { studentId: 2, name: "Emily Nguyen", major: "Biology", riskTier: "Low" as "Low", riskScore: 22, termGpa: 3.90, attendancePct: 98 },
          { studentId: 3, name: "Daniel Owusu", major: "Business Admin", riskTier: "Medium" as "Medium", riskScore: 56, termGpa: 3.10, attendancePct: 85 },
          { studentId: 4, name: "Sofia Martinez", major: "Art History", riskTier: "Low" as "Low", riskScore: 15, termGpa: 3.70, attendancePct: 95 },
          { studentId: 5, name: "Mei Chen", major: "Engineering", riskTier: "High" as "High", riskScore: 79, termGpa: 2.40, attendancePct: 80 },
          { studentId: 6, name: "James Wilson", major: "Psychology", riskTier: "Medium" as "Medium", riskScore: 42, termGpa: 3.20, attendancePct: 88 },
          { studentId: 7, name: "Fatima Hassan", major: "Computer Science", riskTier: "Low" as "Low", riskScore: 18, termGpa: 3.85, attendancePct: 96 },
          { studentId: 8, name: "Lucas Brown", major: "Engineering", riskTier: "High" as "High", riskScore: 85, termGpa: 2.20, attendancePct: 72 },
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
          { term: "Term 1", gpa: 3.2 },
          { term: "Term 2", gpa: 3.4 },
          { term: "Term 3", gpa: 3.7 },
          { term: "Term 4", gpa: 3.9 },
        ],
        recommendations: [
          "Explore Honors Program requirements",
          "Sign up for the Spring research symposium",
          "Meet advisor to discuss 400-level courses",
          "Complete pending course surveys",
        ]
      }
    };
  },
};
