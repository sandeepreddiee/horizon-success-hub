import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const { toast } = useToast();
  const { logout } = useAuth();

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

  // Get unique majors for filter
  const uniqueMajors = useMemo(() => {
    if (!data) return [];
    const majors = [...new Set(data.studentRows.map(s => s.major))];
    return majors.sort();
  }, [data]);

  // Filter students based on selected filters
  const filteredStudents = useMemo(() => {
    if (!data) return [];
    
    return data.studentRows.filter(student => {
      const matchesRisk = riskFilter === "all" || student.riskTier.toLowerCase() === riskFilter;
      const matchesMajor = majorFilter === "all" || student.major === majorFilter;
      return matchesRisk && matchesMajor;
    });
  }, [data, riskFilter, majorFilter]);

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

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Advisor Dashboard</h1>
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
            <StatCard title="Total Students Assigned" value={data.totalStudents.toString()} />
            <StatCard title="High-Risk Students" value={data.highRiskStudents.toString()} trend="danger" />
            <StatCard title="Average Term GPA" value={data.averageTermGpa.toFixed(2)} />
            <StatCard title="Average Attendance %" value={`${data.averageAttendance.toFixed(0)}%`} />
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={majorFilter} onValueChange={setMajorFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueMajors.map(major => (
                  <SelectItem key={major} value={major}>{major}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
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

            <Select defaultValue="all">
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                <SelectItem value="fall2024">Fall 2024</SelectItem>
                <SelectItem value="spring2024">Spring 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Student Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Major</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Risk Tier</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Risk Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Term GPA</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No students found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.studentId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{student.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.major}</td>
                        <td className="px-6 py-4">
                          <RiskBadge level={student.riskTier} />
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{student.riskScore}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{student.termGpa.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{student.attendancePct}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
