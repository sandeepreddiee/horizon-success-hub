import Papa from 'papaparse';
import studentsCSV from '../data/Students.csv?raw';

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

let cachedStudents: StudentData[] | null = null;

export const loadStudents = async (): Promise<StudentData[]> => {
  if (cachedStudents) {
    return cachedStudents;
  }

  return new Promise((resolve, reject) => {
    Papa.parse(studentsCSV, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        cachedStudents = results.data as StudentData[];
        resolve(cachedStudents);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Calculate risk tier based on GPA and credits (simplified logic)
export const calculateRiskTier = (gpa: number, credits: number): "Low" | "Medium" | "High" => {
  const riskScore = calculateRiskScore(gpa, credits);
  if (riskScore >= 70) return "High";
  if (riskScore >= 40) return "Medium";
  return "Low";
};

export const calculateRiskScore = (gpa: number, credits: number): number => {
  // Higher score = higher risk
  // Low GPA increases risk, low credits increases risk
  let score = 0;
  
  if (gpa < 2.0) score += 40;
  else if (gpa < 2.5) score += 30;
  else if (gpa < 3.0) score += 20;
  else if (gpa < 3.5) score += 10;
  
  if (credits < 20) score += 30;
  else if (credits < 40) score += 20;
  else if (credits < 60) score += 10;
  
  return Math.min(score, 100);
};
