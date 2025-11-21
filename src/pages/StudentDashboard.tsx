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

interface GpaTrend {
  term: string;
  gpa: number;
}

interface DashboardData {
  name: string;
  major: string;
  cumulativeGpa: number;
  currentTermGpa: number;
  attendancePct: number;
  engagementScore: number;
  riskTier: "High" | "Medium" | "Low";
  courses: Course[];
  gpaTrend: GpaTrend[];
  recommendations: string[];
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
          <h1 className="text-2xl font-bold text-foreground">Welcome, {data.name.split(" ")[0]}!</h1>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Current Term GPA" value={data.currentTermGpa.toFixed(2)} />
            <StatCard title="Attendance %" value={`${data.attendancePct}%`} />
            <StatCard title="Engagement Score" value={data.engagementScore.toString()} />
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Risk Status</p>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${
                  data.riskTier === "Low" ? "text-green-500" : 
                  data.riskTier === "Medium" ? "text-yellow-500" : "text-destructive"
                }`}>
                  {data.riskTier}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* GPA Trend Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">GPA Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.gpaTrend}>
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
            </div>

            {/* Recommended Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Recommended Actions for You</h3>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => {
                  const icons = [Star, AlertCircle, MessageSquare, ClipboardList];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.courses.map((course, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h4 className="font-semibold text-foreground mb-2">{course.courseName}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{course.credits} credits</span>
                    <span className={`font-semibold ${
                      course.grade.startsWith('A') ? 'text-green-500' :
                      course.grade.startsWith('B') ? 'text-primary' :
                      course.grade.startsWith('C') ? 'text-yellow-500' : 'text-destructive'
                    }`}>
                      {course.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
