import axios from "axios";
import { 
  loadStudents, 
  loadAttendance, 
  calculateAverageAttendance,
  loadAdvisingNotes,
  loadEnrollments,
  loadEnrollmentGrades,
  loadCourses,
  loadFinancialAid,
  loadLMSEvents,
  loadTermGPAs,
  gradeToLetter
} from "./dataLoader";
import { calculateRisk } from "@/lib/riskCalculation";
import './dataCache'; // Trigger data preload

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
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 300ms
    
    // Load real data from CSVs
    const students = await loadStudents();
    const attendance = await loadAttendance();
    
    // Calculate statistics from real data
    const totalStudents = students.length;
    const averageTermGpa = students.reduce((sum, s) => sum + s.cumulative_gpa, 0) / totalStudents;
    
    // Map students with risk and attendance data
    const studentsWithRisk = students.map(s => {
      const avgAttendance = calculateAverageAttendance(attendance, s.student_id);
      const risk = calculateRisk(s.cumulative_gpa, avgAttendance);
      
      return {
        ...s,
        riskScore: risk.riskScore,
        riskTier: risk.riskTier,
        attendancePct: avgAttendance
      };
    });
    
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
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 300ms
    
    const students = await loadStudents();
    const attendance = await loadAttendance();
    
    const studentsWithRisk = students.map(s => {
      const avgAttendance = calculateAverageAttendance(attendance, s.student_id);
      const risk = calculateRisk(s.cumulative_gpa, avgAttendance);
      
      return {
        studentId: s.student_id,
        name: s.name,
        major: s.major,
        riskTier: risk.riskTier,
        riskScore: risk.riskScore,
        termGpa: s.cumulative_gpa,
        attendancePct: avgAttendance
      };
    });
    
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
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms
    
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
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms
    
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
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 300ms
    
    // Load all data
    const students = await loadStudents();
    const attendance = await loadAttendance();
    const advisingNotes = await loadAdvisingNotes();
    const enrollments = await loadEnrollments();
    const enrollmentGrades = await loadEnrollmentGrades();
    const courses = await loadCourses();
    const financialAid = await loadFinancialAid();
    const lmsEvents = await loadLMSEvents();
    const termGPAs = await loadTermGPAs();
    
    const student = students.find(s => s.student_id === studentId);
    
    if (!student) {
      throw new Error("Student not found");
    }
    
    // Calculate risk based on GPA and attendance
    const avgAttendance = calculateAverageAttendance(attendance, studentId);
    const riskData = calculateRisk(student.cumulative_gpa, avgAttendance);
    
    // Get financial aid data
    const financial = financialAid.find(f => f.student_id === studentId);
    
    // Get student enrollments and grades for term 1
    const studentEnrollments = enrollments.filter(e => e.student_id === studentId && e.term_id === 1);
    const coursesData = studentEnrollments.map(enrollment => {
      const course = courses.find(c => c.course_id === enrollment.course_id);
      const grade = enrollmentGrades.find(g => 
        g.student_id === studentId && 
        g.course_id === enrollment.course_id && 
        g.term_id === 1
      );
      
      // Extract credits from course title (e.g., "CS 200" -> level / 100 = 2 credits minimum, + 1-2)
      const credits = course ? Math.floor(course.level / 100) + 2 : 3;
      
      return {
        courseName: course?.title || "Unknown Course",
        credits,
        grade: grade ? gradeToLetter(grade.course_gpa) : "N/A",
        numericGrade: grade?.numeric_grade || 0,
        courseGpa: grade?.course_gpa || 0
      };
    });
    
    // Get attendance by course for this student
    const studentAttendance = attendance.filter(a => a.student_id === studentId && a.term_id === 1);
    const attendanceByCourse = studentEnrollments.map(enrollment => {
      const course = courses.find(c => c.course_id === enrollment.course_id);
      const courseAttendance = studentAttendance.filter(a => a.course_id === enrollment.course_id);
      const avgAttendance = courseAttendance.length > 0
        ? courseAttendance.reduce((sum, a) => sum + a.attendance_pct, 0) / courseAttendance.length
        : 0;
      
      return {
        courseName: course?.title || "Unknown Course",
        percentage: Math.round(avgAttendance * 10) / 10
      };
    });
    
    // Get term GPAs
    const studentTermGPAs = termGPAs.filter(t => t.student_id === studentId);
    const termGpas = studentTermGPAs.map(t => ({
      term: `Term ${t.term_id}`,
      gpa: t.term_gpa
    }));
    
    // Get LMS activity for term 1
    const studentLMS = lmsEvents.filter(l => l.student_id === studentId && l.term_id === 1);
    const lmsActivity = {
      weeklyLogins: studentLMS.map(l => ({ week: `Week ${l.week_number}`, count: l.logins })),
      weeklyTimeSpent: studentLMS.map(l => ({ week: `Week ${l.week_number}`, hours: Math.round(l.time_on_platform_min / 60 * 10) / 10 })),
      weeklyAssignments: studentLMS.map(l => ({ week: `Week ${l.week_number}`, count: l.assignments_submitted }))
    };
    
    // Get advising notes
    const studentNotes = advisingNotes.filter(n => n.student_id === studentId);
    const notes = studentNotes.map(n => ({
      type: n.intervention_type,
      date: n.note_date,
      content: `${n.intervention_type.replace(/_/g, ' ')} intervention on ${n.note_date}`
    }));
    
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
        
        // Term GPAs from CSV
        termGpas,
        
        // Courses with real grades from CSV
        courses: coursesData,
        
        // LMS engagement data from CSV
        lmsActivity,
        
        // Attendance data from CSV
        attendanceByCourse,
        averageAttendance: calculateAverageAttendance(attendance, studentId),
        
        // Financial data from CSV
        financial: {
          aidAmount: financial?.aid_amount_usd || null,
          hasScholarship: financial?.scholarship_flag === 1,
          householdIncome: financial?.household_income_usd || null,
          workHours: financial?.work_hours_per_week || null,
          outstandingBalance: financial?.outstanding_balance_usd || null
        },
        
        // Risk prediction calculated from GPA and attendance
        riskScore: riskData.riskScore,
        riskTier: riskData.riskTier,
        
        // Advising notes from CSV
        advisingNotes: notes
      }
    };
  },
};
