import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { studentAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Star, FlaskConical, GraduationCap, ClipboardCheck } from "lucide-react";

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
  const { studentId } = useAuth();
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
      <Layout title="Welcome!" role="STUDENT">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Welcome!" role="STUDENT">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No data available. Make sure your backend is running at http://localhost:8081</p>
        </div>
      </Layout>
    );
  }

  const chartData = {
    labels: data.gpaTrend.map((t) => t.term),
    datasets: [
      {
        label: "GPA",
        data: data.gpaTrend.map((t) => t.gpa),
        borderColor: "hsl(186, 48%, 44%)",
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
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const recommendationIcons = [Star, FlaskConical, GraduationCap, ClipboardCheck];

  return (
    <Layout title={`Welcome, ${data.name}!`} role="STUDENT">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard label="Current Term GPA" value={data.currentTermGpa.toFixed(2)} />
        <StatCard label="Attendance %" value={`${data.attendancePct}%`} />
        <StatCard label="Engagement Score" value={data.engagementScore} />
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Risk Status</p>
          <RiskBadge tier={data.riskTier} className="text-2xl py-2 px-4" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">GPA Trend</h3>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Recommended Actions for You</h3>
          <ul className="space-y-4">
            {data.recommendations.map((rec, index) => {
              const Icon = recommendationIcons[index % recommendationIcons.length];
              return (
                <li key={index} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {data.courses && data.courses.length > 0 && (
        <div className="mt-6 bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">My Courses</h3>
          <div className="grid grid-cols-3 gap-4">
            {data.courses.map((course, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground">{course.courseName}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.credits} credits • Grade: {course.grade}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentDashboard;
