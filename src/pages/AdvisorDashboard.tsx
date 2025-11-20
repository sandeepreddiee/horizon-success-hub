import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface StudentRow {
  studentId: number;
  name: string;
  major: string;
  riskTier: "High" | "Medium" | "Low";
  riskScore: number;
  termGpa: number;
  attendancePct: number;
}

interface DashboardData {
  totalStudents: number;
  highRiskStudents: number;
  averageTermGpa: number;
  averageAttendance: number;
  studentRows: StudentRow[];
}

const AdvisorDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await advisorAPI.getDashboard();
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
  }, [toast]);

  if (isLoading) {
    return (
      <Layout title="Advisor Dashboard" role="ADVISOR">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Advisor Dashboard" role="ADVISOR">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No data available. Make sure your backend is running at http://localhost:8081</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Advisor Dashboard" role="ADVISOR">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Students Assigned" value={data.totalStudents} />
        <StatCard
          label="High-Risk Students"
          value={data.highRiskStudents}
          valueColor="text-risk-high-text"
        />
        <StatCard label="Average Term GPA" value={data.averageTermGpa.toFixed(2)} />
        <StatCard label="Average Attendance %" value={`${data.averageAttendance.toFixed(0)}%`} />
      </div>

      <div className="flex gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="bio">Biology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Risk Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Tiers</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="current">
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Term</SelectItem>
            <SelectItem value="previous">Previous Term</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Student Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Major
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Risk Tier
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Risk Score
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Term GPA
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Attendance %
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.studentRows.map((student) => (
              <tr
                key={student.studentId}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/advisor/student/${student.studentId}/notes`)}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">{student.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{student.major}</td>
                <td className="px-6 py-4">
                  <RiskBadge tier={student.riskTier} />
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{student.riskScore}</td>
                <td className="px-6 py-4 text-sm text-foreground">{student.termGpa.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-foreground">{student.attendancePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdvisorDashboard;
