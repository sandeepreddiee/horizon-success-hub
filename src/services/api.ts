import axios from "axios";
import { loadStudents, calculateRiskTier, calculateRiskScore } from "./dataLoader";

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

// In-memory storage for notes (per student)
const notesStorage: { [studentId: number]: Array<{ noteId: number; content: string; timestamp: string }> } = {};

export const advisorAPI = {
  getDashboard: async (page: number = 1, pageSize: number = 50, riskFilter: string = "all", majorFilter: string = "all") => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Load real student data
    const students = await loadStudents();
    
    // Calculate statistics from real data
    const totalStudents = students.length;
    const averageTermGpa = students.reduce((sum, s) => sum + s.cumulative_gpa, 0) / totalStudents;
    
    // Simulate attendance (since not in CSV) - generate consistent random values
    const getAttendance = (studentId: number) => {
      const seed = studentId * 12345;
      const random = (seed % 30) + 70; // 70-100% range
      return random;
    };
    
    // Calculate risk for each student
    const studentsWithRisk = students.map(s => ({
      ...s,
      riskScore: calculateRiskScore(s.cumulative_gpa, s.credits_completed),
      riskTier: calculateRiskTier(s.cumulative_gpa, s.credits_completed),
      attendancePct: getAttendance(s.student_id)
    }));
    
    // Calculate counts
    const highRiskStudents = studentsWithRisk.filter(s => s.riskTier === "High").length;
    const mediumRiskStudents = studentsWithRisk.filter(s => s.riskTier === "Medium").length;
    const lowRiskStudents = studentsWithRisk.filter(s => s.riskTier === "Low").length;
    const averageAttendance = studentsWithRisk.reduce((sum, s) => sum + s.attendancePct, 0) / totalStudents;
    
    // Apply filters
    let filteredStudents = studentsWithRisk;
    if (riskFilter !== "all") {
      filteredStudents = filteredStudents.filter(s => s.riskTier.toLowerCase() === riskFilter);
    }
    if (majorFilter !== "all") {
      filteredStudents = filteredStudents.filter(s => s.major === majorFilter);
    }
    
    // Calculate pagination
    const totalFiltered = filteredStudents.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Get paginated data
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
    
    const studentRows = paginatedStudents.map(s => ({
      studentId: s.student_id,
      name: s.name,
      major: s.major,
      riskTier: s.riskTier,
      riskScore: s.riskScore,
      termGpa: s.cumulative_gpa,
      attendancePct: s.attendancePct
    }));
    
    return {
      data: {
        totalStudents,
        highRiskStudents,
        mediumRiskStudents,
        lowRiskStudents,
        averageTermGpa: Math.round(averageTermGpa * 100) / 100,
        averageAttendance: Math.round(averageAttendance * 10) / 10,
        studentRows,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalFiltered
        }
      }
    };
  },
  getStudents: async (page: number = 1, pageSize: number = 30, searchQuery: string = "") => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const students = await loadStudents();
    
    const getAttendance = (studentId: number) => {
      const seed = studentId * 12345;
      return (seed % 30) + 70;
    };
    
    const studentsWithRisk = students.map(s => ({
      studentId: s.student_id,
      name: s.name,
      major: s.major,
      riskTier: calculateRiskTier(s.cumulative_gpa, s.credits_completed),
      riskScore: calculateRiskScore(s.cumulative_gpa, s.credits_completed),
      termGpa: s.cumulative_gpa,
      attendancePct: getAttendance(s.student_id)
    }));
    
    let filtered = studentsWithRisk;
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.major.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const totalFiltered = filtered.length;
    const totalPages = Math.ceil(totalFiltered / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedStudents = filtered.slice(startIndex, startIndex + pageSize);
    
    return {
      data: {
        students: paginatedStudents,
        pagination: {
          currentPage: page,
          pageSize,
          totalPages,
          totalFiltered
        }
      }
    };
  },
  getNotes: async (studentId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Initialize with default notes if not exists
    if (!notesStorage[studentId]) {
      notesStorage[studentId] = [
        { noteId: 1, content: "Student showed improvement in attendance this week. Encouraged to continue.", timestamp: "2024-11-15T10:30:00Z" },
        { noteId: 2, content: "Discussed study strategies for upcoming midterms. Student seems motivated.", timestamp: "2024-11-10T14:15:00Z" },
      ];
    }
    
    return {
      data: {
        notes: notesStorage[studentId].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      }
    };
  },
  addNote: async (studentId: number, content: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Initialize if not exists
    if (!notesStorage[studentId]) {
      notesStorage[studentId] = [];
    }
    
    const newNote = {
      noteId: Date.now(),
      content,
      timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (most recent first)
    notesStorage[studentId].unshift(newNote);
    
    return {
      data: newNote
    };
  },
};

export const studentAPI = {
  getDashboard: async (studentId: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const students = await loadStudents();
    const student = students.find(s => s.student_id === studentId);
    
    if (!student) {
      throw new Error("Student not found");
    }
    
    // Use real data from Students.csv
    return {
      data: {
        // Real student profile data
        name: student.name,
        major: student.major,
        cumulativeGpa: student.cumulative_gpa,
        creditsCompleted: student.credits_completed,
        age: student.age,
        gender: student.gender,
        residencyStatus: student.residency_status,
        firstGen: student.first_gen === 1,
        
        // Placeholders for data from other CSV files (to be loaded when available)
        termGpas: [], // Will come from performance data
        courses: [], // Will come from course enrollments
        courseGrades: [], // Will come from course grades
        
        // LMS engagement data (to be loaded from weekly LMS activity CSV)
        lmsActivity: {
          weeklyLogins: [],
          weeklyTimeSpent: [],
          weeklyAssignments: []
        },
        
        // Attendance data (to be loaded from attendance CSV)
        attendanceByCourse: [],
        
        // Financial data (to be loaded from financial CSV)
        financial: {
          aidAmount: null,
          hasScholarship: false,
          householdIncome: null,
          workHours: null,
          outstandingBalance: null
        },
        
        // Risk prediction (to be loaded from ML risk CSV)
        riskScore: null,
        riskTier: null,
        
        // Advising notes (to be loaded from notes CSV)
        advisingNotes: []
      }
    };
  },
};
