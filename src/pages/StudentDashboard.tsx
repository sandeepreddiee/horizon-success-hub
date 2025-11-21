import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { studentAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Star, FlaskConical, GraduationCap, ClipboardCheck, LogOut, Users } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

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
      const isLovablePreview = window.location.hostname.endsWith("lovableproject.com");

      // Use mock data in preview environment
      if (isLovablePreview) {
        const mockData: DashboardData = {
          name: "Emma Johnson",
          major: "Computer Science",
          cumulativeGpa: 3.45,
          currentTermGpa: 3.2,
          attendancePct: 88,
          engagementScore: 75,
          riskTier: "Medium",
          courses: [
            { courseName: "Data Structures", credits: 4, grade: "B+" },
            { courseName: "Web Development", credits: 3, grade: "A-" },
            { courseName: "Database Systems", credits: 3, grade: "B" },
            { courseName: "Software Engineering", credits: 4, grade: "A" },
          ],
          gpaTrend: [
            { term: "Fall 2023", gpa: 3.2 },
            { term: "Spring 2024", gpa: 3.4 },
            { term: "Fall 2024", gpa: 3.5 },
          ],
          recommendations: [
            "Attend the Math Tutoring Center on Tuesdays and Thursdays",
            "Meet with your academic advisor to discuss course load",
            "Join a study group for Data Structures course",
            "Consider attending office hours for additional support",
          ]
        };
        setData(mockData);
        setIsLoading(false);
        return;
      }

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
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.gpaTrend.map((t) => t.term),
    datasets: [
      {
        label: "GPA Trend",
        data: data.gpaTrend.map((t) => t.gpa),
        borderColor: "hsl(186 48% 44%)",
        backgroundColor: "hsla(186, 48%, 44%, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 0, max: 4.0, ticks: { stepSize: 0.5 } },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {data.name}!</h2>
          <p className="text-muted-foreground">{data.major}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Cumulative GPA" value={data.cumulativeGpa.toFixed(2)} icon={Star} />
          <StatCard title="Current Term GPA" value={data.currentTermGpa.toFixed(2)} icon={FlaskConical} />
          <StatCard title="Attendance Rate" value={`${data.attendancePct}%`} icon={ClipboardCheck} />
          <StatCard title="Engagement Score" value={`${data.engagementScore}%`} icon={GraduationCap} />
        </div>

        {/* Risk Status and GPA Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <RiskBadge level={data.riskTier} />
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">GPA Trend</h3>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Current Courses */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Current Courses</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Course Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Credits</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Current Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.courses.map((course, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-foreground">{course.courseName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{course.credits}</td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{course.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Personalized Recommendations</h3>
          <ul className="space-y-3">
            {data.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </span>
                <span className="text-sm text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
