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
  console.log('🚀 Starting data preload...');
  const startTime = performance.now();
  
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
    const endTime = performance.now();
    console.log(`✅ All data preloaded in ${Math.round(endTime - startTime)}ms`);
  });
  
  return preloadPromise;
};

// Start preloading immediately
preloadAllData();
