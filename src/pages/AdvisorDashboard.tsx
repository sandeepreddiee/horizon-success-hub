import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, AlertTriangle, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  mediumRiskStudents: number;
  lowRiskStudents: number;
  averageTermGpa: number;
  averageAttendance: number;
  studentRows: StudentRow[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalFiltered: number;
  };
}

const AdvisorDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { toast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await advisorAPI.getDashboard(currentPage, pageSize, riskFilter, majorFilter);
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
  }, [currentPage, pageSize, riskFilter, majorFilter, toast]);

  // Get unique majors for filter (from API)
  const uniqueMajors = useMemo(() => {
    if (!data) return [];
    const majors = [...new Set(data.studentRows.map(s => s.major))];
    return majors.sort();
  }, [data]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [riskFilter, majorFilter]);

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
          <h1 className="text-2xl font-heading font-semibold text-foreground">Advisor Dashboard</h1>
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
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Students Assigned" value={data.totalStudents.toString()} icon={Users} />
            <StatCard title="Average Term GPA" value={data.averageTermGpa.toFixed(2)} />
            <StatCard title="Average Attendance %" value={`${data.averageAttendance}%`} />
            <StatCard title="Completion Rate" value="92%" />
          </div>

          {/* Risk Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg border border-destructive/20 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">High Risk</span>
                </div>
              </div>
              <p className="text-3xl font-heading font-bold text-destructive mb-1">{data.highRiskStudents}</p>
              <p className="text-xs text-muted-foreground">
                {((data.highRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg border border-yellow-500/20 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Medium Risk</span>
                </div>
              </div>
              <p className="text-3xl font-heading font-bold text-yellow-600 mb-1">{data.mediumRiskStudents}</p>
              <p className="text-xs text-muted-foreground">
                {((data.mediumRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Low Risk</span>
                </div>
              </div>
              <p className="text-3xl font-heading font-bold text-green-600 mb-1">{data.lowRiskStudents}</p>
              <p className="text-xs text-muted-foreground">
                {((data.lowRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
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
            
            <div className="text-sm text-muted-foreground">
              Showing {data.studentRows.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, data.pagination.totalFiltered)} of {data.pagination.totalFiltered} students
            </div>
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
                  {data.studentRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No students found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    data.studentRows.map((student) => (
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
            
            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {data.pagination.currentPage} of {data.pagination.totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(data.pagination.totalPages)}
                    disabled={currentPage === data.pagination.totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
