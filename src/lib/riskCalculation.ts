/**
 * Calculate risk score and tier based on GPA and attendance
 * Risk score is calculated with weighted factors:
 * - GPA (60% weight): Lower GPA = higher risk
 * - Attendance (40% weight): Lower attendance = higher risk
 */

export interface RiskAssessment {
  riskScore: number; // 0-100, higher = more risk
  riskTier: "Low" | "Medium" | "High";
}

export const calculateRisk = (gpa: number, attendancePct: number): RiskAssessment => {
  // Normalize GPA component (4.0 scale to 0-100 risk scale, inverted)
  // GPA 4.0 = 0 risk points, GPA 0.0 = 100 risk points
  const gpaRisk = ((4.0 - Math.min(gpa, 4.0)) / 4.0) * 100 * 0.6;
  
  // Normalize attendance component (0-100 to 0-100 risk scale, inverted)
  // 100% attendance = 0 risk points, 0% attendance = 100 risk points
  const attendanceRisk = ((100 - Math.max(0, attendancePct)) / 100) * 100 * 0.4;
  
  // Calculate total risk score (0-100)
  const totalRiskScore = Math.round(gpaRisk + attendanceRisk);
  
  // Determine risk tier based on score
  let riskTier: "Low" | "Medium" | "High";
  if (totalRiskScore >= 60) {
    riskTier = "High";
  } else if (totalRiskScore >= 30) {
    riskTier = "Medium";
  } else {
    riskTier = "Low";
  }
  
  return {
    riskScore: totalRiskScore,
    riskTier
  };
};
