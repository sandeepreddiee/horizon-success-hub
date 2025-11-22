import { 
  loadStudents, 
  loadAttendance, 
  loadEnrollments,
  loadEnrollmentGrades,
  loadCourses,
  loadFinancialAid,
  loadLMSEvents,
  loadTermGPAs,
  loadAdvisingNotes
} from './dataLoader';

// Pre-load and cache all data at startup
let isPreloading = false;
let preloadPromise: Promise<void> | null = null;

export const preloadAllData = async () => {
  if (isPreloading || preloadPromise) {
    return preloadPromise;
  }
  
  isPreloading = true;
  preloadPromise = Promise.all([
    loadStudents(),
    loadAttendance(),
    loadEnrollments(),
    loadEnrollmentGrades(),
    loadCourses(),
    loadFinancialAid(),
    loadLMSEvents(),
    loadTermGPAs(),
    loadAdvisingNotes()
  ]).then(() => {
    console.log('✅ All data preloaded successfully');
  });
  
  return preloadPromise;
};

// Start preloading immediately
preloadAllData();
