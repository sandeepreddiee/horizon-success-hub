import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import StudentSidebar from "@/components/StudentSidebar";
import { studentAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, Star, AlertCircle, MessageSquare, ClipboardList } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface Course {
  courseName: string;
  credits: number;
  grade: string;
}

interface LMSActivity {
  weeklyLogins: Array<{ week: string; count: number }>;
  weeklyTimeSpent: Array<{ week: string; hours: number }>;
  weeklyAssignments: Array<{ week: string; count: number }>;
}

interface Financial {
  aidAmount: number | null;
  hasScholarship: boolean;
  householdIncome: number | null;
  workHours: number | null;
  outstandingBalance: number | null;
}

interface DashboardData {
  // Real student profile data
  name: string;
  major: string;
  cumulativeGpa: number;
  creditsCompleted: number;
  age: number;
  gender: string;
  residencyStatus: string;
  firstGen: boolean;
  
  // Data from other CSV files
  termGpas: Array<{ term: string; gpa: number }>;
  courses: Course[];
  courseGrades: Array<{ courseName: string; grade: string }>;
  lmsActivity: LMSActivity;
  attendanceByCourse: Array<{ courseName: string; percentage: number }>;
  financial: Financial;
  riskScore: number | null;
  riskTier: "High" | "Medium" | "Low" | null;
  advisingNotes: Array<{ type: string; date: string; content: string }>;
}

const StudentDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { studentId, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;
      
      try {
        const response = await studentAPI.getDashboard(studentId);
        setData(response.data);
      } catch (error: any) {
        console.error("Dashboard error:", error);
        toast({
          title: "Error loading dashboard",
          description: error.response?.data?.message || error.message || "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Welcome, {data.name.split(" ")[0]}!</h1>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Student Profile Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Student Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Major</p>
                <p className="text-base font-medium text-foreground">{data.major}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits Completed</p>
                <p className="text-base font-medium text-foreground">{data.creditsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-base font-medium text-foreground">{data.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">First Generation</p>
                <p className="text-base font-medium text-foreground">{data.firstGen ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="text-base font-medium text-foreground">{data.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Residency</p>
                <p className="text-base font-medium text-foreground">{data.residencyStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                <p className="text-base font-medium text-foreground">{data.cumulativeGpa.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Risk Status - Only show if data available */}
          {data.riskTier && (
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Risk Assessment</h3>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Tier</p>
                  <span className={`text-2xl font-heading font-semibold ${
                    data.riskTier === "Low" ? "text-green-600" : 
                    data.riskTier === "Medium" ? "text-yellow-600" : "text-destructive"
                  }`}>
                    {data.riskTier}
                  </span>
                </div>
                {data.riskScore && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                    <p className="text-2xl font-heading font-semibold text-foreground">{data.riskScore}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Not Yet Available Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Course Enrollments</h3>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">Course data will be available when enrollment CSV is uploaded</p>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Term GPA Trend</h3>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">Term GPA data will be available when performance CSV is uploaded</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">LMS Engagement</h3>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">LMS activity data will be available when engagement CSV is uploaded</p>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Attendance</h3>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">Attendance data will be available when attendance CSV is uploaded</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Financial Information</h3>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">Financial data will be available when financial CSV is uploaded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
