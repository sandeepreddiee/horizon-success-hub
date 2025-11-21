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
  numericGrade: number;
  courseGpa: number;
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
  
  // Data from CSV files
  termGpas: Array<{ term: string; gpa: number }>;
  courses: Course[];
  lmsActivity: LMSActivity;
  attendanceByCourse: Array<{ courseName: string; percentage: number }>;
  averageAttendance: number;
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
      if (!studentId) {
        setIsLoading(false);
        return;
      }
      
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
          {/* Student Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Cumulative GPA" value={data.cumulativeGpa.toFixed(2)} />
            <StatCard title="Credits Completed" value={data.creditsCompleted.toString()} />
            <StatCard title="Average Attendance" value={`${data.averageAttendance?.toFixed(1) || 0}%`} />
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">ML Risk Prediction</p>
              <div className="flex flex-col gap-1">
                {data.riskTier ? (
                  <>
                    <span className={`text-3xl font-heading font-semibold ${
                      data.riskTier === "Low" ? "text-green-600" : 
                      data.riskTier === "Medium" ? "text-yellow-600" : "text-destructive"
                    }`}>
                      {data.riskTier}
                    </span>
                    <p className="text-xs text-muted-foreground">Based on multiple factors</p>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No data</span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Profile Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Major</p>
                <p className="text-base font-medium text-foreground">{data.major}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-base font-medium text-foreground">{data.age}</p>
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
                <p className="text-sm text-muted-foreground">First Generation</p>
                <p className="text-base font-medium text-foreground">{data.firstGen ? "Yes" : "No"}</p>
              </div>
              {data.riskScore !== null && (
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-base font-medium text-foreground">{data.riskScore}/100</p>
                </div>
              )}
            </div>
          </div>

          {/* LMS Activity Overview */}
          {data.lmsActivity && (data.lmsActivity.weeklyLogins.length > 0 || data.lmsActivity.weeklyTimeSpent.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Weekly Logins */}
              {data.lmsActivity.weeklyLogins.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Weekly Logins</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.lmsActivity.weeklyLogins}>
                      <defs>
                        <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px"}} />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorLogins)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Weekly Time Spent */}
              {data.lmsActivity.weeklyTimeSpent.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Time on Platform (hrs)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.lmsActivity.weeklyTimeSpent}>
                      <defs>
                        <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px"}} />
                      <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorTime)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Weekly Assignments */}
              {data.lmsActivity.weeklyAssignments.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Assignments Submitted</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.lmsActivity.weeklyAssignments}>
                      <defs>
                        <linearGradient id="colorAssignments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px"}} />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorAssignments)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* GPA Trend and Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Term GPA Trend */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Term GPA Trend</h3>
              {data.termGpas && data.termGpas.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={data.termGpas}>
                    <defs>
                      <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="term" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      domain={[0, 4.0]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gpa" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#colorGpa)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p className="text-sm">No term GPA data available</p>
                </div>
              )}
            </div>

            {/* Current Courses */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Current Courses</h3>
              {data.courses && data.courses.length > 0 ? (
                <div className="space-y-3">
                  {data.courses.slice(0, 5).map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{course.courseName}</p>
                        <p className="text-xs text-muted-foreground">{course.credits} credits</p>
                      </div>
                      <span className={`text-lg font-semibold ${
                        course.grade.startsWith('A') ? 'text-green-600' :
                        course.grade.startsWith('B') ? 'text-blue-600' :
                        course.grade.startsWith('C') ? 'text-yellow-600' : 'text-destructive'
                      }`}>
                        {course.grade}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p className="text-sm">No course data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          {data.financial && (
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Financial Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aid Amount</p>
                  <p className="text-base font-medium text-foreground">
                    ${data.financial.aidAmount?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scholarship</p>
                  <p className="text-base font-medium text-foreground">
                    {data.financial.hasScholarship ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Household Income</p>
                  <p className="text-base font-medium text-foreground">
                    ${data.financial.householdIncome?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Work Hours/Week</p>
                  <p className="text-base font-medium text-foreground">
                    {data.financial.workHours || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-base font-medium text-foreground">
                    ${data.financial.outstandingBalance?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advising Notes */}
          {data.advisingNotes && data.advisingNotes.length > 0 && (
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Interventions</h3>
              <div className="space-y-3">
                {data.advisingNotes.slice(0, 5).map((note, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {note.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
