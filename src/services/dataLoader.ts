import Papa from 'papaparse';
import studentsCSV from '../data/Students.csv?raw';
import advisingNotesCSV from '../data/AdvisingNotes.csv?raw';
import attendanceCSV from '../data/Attendance.csv?raw';
import coursesCSV from '../data/Courses.csv?raw';
import enrollmentsCSV from '../data/Enrollments.csv?raw';
import enrollmentsGradesCSV from '../data/Enrollments_Grades.csv?raw';
import financialAidCSV from '../data/FinancialAid.csv?raw';
import lmsEventsCSV from '../data/LMS_Events.csv?raw';
import riskScoresCSV from '../data/RiskScores.csv?raw';
import termGPAsCSV from '../data/Term_GPAs.csv?raw';

// Student Profile Data
export interface StudentData {
  student_id: number;
  name: string;
  gender: string;
  age: number;
  residency_status: string;
  first_gen: number;
  major: string;
  cumulative_gpa: number;
  credits_completed: number;
}

// Advising Notes Data
export interface AdvisingNoteData {
  note_id: number;
  student_id: number;
  term_id: number;
  intervention_type: string;
  note_date: string;
}

// Attendance Data
export interface AttendanceData {
  student_id: number;
  term_id: number;
  course_id: number;
  month: string;
  attendance_pct: number;
}

// Course Data
export interface CourseData {
  course_id: number;
  dept: string;
  level: number;
  title: string;
}

// Enrollment Data
export interface EnrollmentData {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  term_id: number;
}

// Enrollment Grades Data
export interface EnrollmentGradeData {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  term_id: number;
  numeric_grade: number;
  course_gpa: number;
}

// Financial Aid Data
export interface FinancialAidData {
  student_id: number;
  household_income_usd: number;
  scholarship_flag: number;
  aid_amount_usd: number;
  work_hours_per_week: number;
  outstanding_balance_usd: number;
}

// LMS Events Data
export interface LMSEventData {
  student_id: number;
  term_id: number;
  week_number: number;
  logins: number;
  time_on_platform_min: number;
  assignments_submitted: number;
}

// Risk Score Data
export interface RiskScoreData {
  student_id: number;
  term_id: number;
  risk_score: number;
  risk_tier: "Low" | "Medium" | "High";
}

// Term GPA Data
export interface TermGPAData {
  student_id: number;
  term_gpa: number;
  term_id: number;
}

// Caching
let cachedStudents: StudentData[] | null = null;
let cachedAdvisingNotes: AdvisingNoteData[] | null = null;
let cachedAttendance: AttendanceData[] | null = null;
let cachedCourses: CourseData[] | null = null;
let cachedEnrollments: EnrollmentData[] | null = null;
let cachedEnrollmentGrades: EnrollmentGradeData[] | null = null;
let cachedFinancialAid: FinancialAidData[] | null = null;
let cachedLMSEvents: LMSEventData[] | null = null;
let cachedRiskScores: RiskScoreData[] | null = null;
let cachedTermGPAs: TermGPAData[] | null = null;

// Generic CSV loader
const loadCSV = <T>(csvData: string, cache: T[] | null): Promise<T[]> => {
  if (cache) {
    return Promise.resolve(cache);
  }

  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Load functions for each dataset
export const loadStudents = async (): Promise<StudentData[]> => {
  if (!cachedStudents) {
    cachedStudents = await loadCSV<StudentData>(studentsCSV, cachedStudents);
  }
  return cachedStudents;
};

export const loadAdvisingNotes = async (): Promise<AdvisingNoteData[]> => {
  if (!cachedAdvisingNotes) {
    cachedAdvisingNotes = await loadCSV<AdvisingNoteData>(advisingNotesCSV, cachedAdvisingNotes);
  }
  return cachedAdvisingNotes;
};

export const loadAttendance = async (): Promise<AttendanceData[]> => {
  if (!cachedAttendance) {
    cachedAttendance = await loadCSV<AttendanceData>(attendanceCSV, cachedAttendance);
  }
  return cachedAttendance;
};

export const loadCourses = async (): Promise<CourseData[]> => {
  if (!cachedCourses) {
    cachedCourses = await loadCSV<CourseData>(coursesCSV, cachedCourses);
  }
  return cachedCourses;
};

export const loadEnrollments = async (): Promise<EnrollmentData[]> => {
  if (!cachedEnrollments) {
    cachedEnrollments = await loadCSV<EnrollmentData>(enrollmentsCSV, cachedEnrollments);
  }
  return cachedEnrollments;
};

export const loadEnrollmentGrades = async (): Promise<EnrollmentGradeData[]> => {
  if (!cachedEnrollmentGrades) {
    cachedEnrollmentGrades = await loadCSV<EnrollmentGradeData>(enrollmentsGradesCSV, cachedEnrollmentGrades);
  }
  return cachedEnrollmentGrades;
};

export const loadFinancialAid = async (): Promise<FinancialAidData[]> => {
  if (!cachedFinancialAid) {
    cachedFinancialAid = await loadCSV<FinancialAidData>(financialAidCSV, cachedFinancialAid);
  }
  return cachedFinancialAid;
};

export const loadLMSEvents = async (): Promise<LMSEventData[]> => {
  if (!cachedLMSEvents) {
    cachedLMSEvents = await loadCSV<LMSEventData>(lmsEventsCSV, cachedLMSEvents);
  }
  return cachedLMSEvents;
};

export const loadRiskScores = async (): Promise<RiskScoreData[]> => {
  if (!cachedRiskScores) {
    cachedRiskScores = await loadCSV<RiskScoreData>(riskScoresCSV, cachedRiskScores);
  }
  return cachedRiskScores;
};

export const loadTermGPAs = async (): Promise<TermGPAData[]> => {
  if (!cachedTermGPAs) {
    cachedTermGPAs = await loadCSV<TermGPAData>(termGPAsCSV, cachedTermGPAs);
  }
  return cachedTermGPAs;
};

// Helper function to convert course_gpa to letter grade
export const gradeToLetter = (courseGpa: number): string => {
  if (courseGpa >= 4.0) return "A";
  if (courseGpa >= 3.7) return "A-";
  if (courseGpa >= 3.3) return "B+";
  if (courseGpa >= 3.0) return "B";
  if (courseGpa >= 2.7) return "B-";
  if (courseGpa >= 2.3) return "C+";
  if (courseGpa >= 2.0) return "C";
  if (courseGpa >= 1.7) return "C-";
  if (courseGpa >= 1.3) return "D+";
  if (courseGpa >= 1.0) return "D";
  return "F";
};

// Calculate average attendance for a student across all courses
export const calculateAverageAttendance = (attendance: AttendanceData[], studentId: number): number => {
  const studentAttendance = attendance.filter(a => a.student_id === studentId);
  if (studentAttendance.length === 0) return 0;
  
  const sum = studentAttendance.reduce((acc, curr) => acc + curr.attendance_pct, 0);
  return Math.round((sum / studentAttendance.length) * 10) / 10;
};
