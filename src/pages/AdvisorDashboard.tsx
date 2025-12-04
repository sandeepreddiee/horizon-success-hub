import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, AlertTriangle, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, TrendingUp, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

  const uniqueMajors = useMemo(() => {
    if (!data) return [];
    const majors = [...new Set(data.studentRows.map(s => s.major))];
    return majors.sort();
  }, [data]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [riskFilter, majorFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdvisorSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6 animate-fade-in">
            <Skeleton className="h-10 w-72" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
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
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Advisor Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Monitor and support your assigned students</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Live data</span>
              </div>
              <Button
                variant="ghost"
                onClick={logout}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
            <StatCard 
              title="Total Students" 
              value={data.totalStudents.toLocaleString()} 
              icon={Users}
              subtitle="Assigned to you"
            />
            <StatCard 
              title="Average GPA" 
              value={data.averageTermGpa.toFixed(2)} 
              icon={GraduationCap}
              subtitle="Current term"
            />
            <StatCard 
              title="Attendance Rate" 
              value={`${data.averageAttendance}%`} 
              icon={TrendingUp}
              subtitle="All students"
            />
            <StatCard 
              title="Completion Rate" 
              value="92%" 
              subtitle="On track"
            />
          </div>

          {/* Risk Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in stagger-1">
            <div className="risk-card-high rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">High Risk</span>
                </div>
                <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                  Needs attention
                </span>
              </div>
              <p className="text-4xl font-heading font-bold text-destructive mb-2">{data.highRiskStudents}</p>
              <p className="text-sm text-muted-foreground">
                {((data.highRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>

            <div className="risk-card-medium rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Medium Risk</span>
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">
                  Monitor
                </span>
              </div>
              <p className="text-4xl font-heading font-bold text-amber-600 mb-2">{data.mediumRiskStudents}</p>
              <p className="text-sm text-muted-foreground">
                {((data.mediumRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>

            <div className="risk-card-low rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Low Risk</span>
                </div>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  On track
                </span>
              </div>
              <p className="text-4xl font-heading font-bold text-success mb-2">{data.lowRiskStudents}</p>
              <p className="text-sm text-muted-foreground">
                {((data.lowRiskStudents / data.totalStudents) * 100).toFixed(1)}% of total students
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-2xl p-5 border border-border shadow-sm animate-fade-in stagger-2">
            <div className="flex flex-wrap gap-3">
              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger className="w-52 rounded-xl input-premium">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueMajors.map(major => (
                    <SelectItem key={major} value={major}>{major}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-44 rounded-xl input-premium">
                  <SelectValue placeholder="All Risk Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Tiers</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground">{data.studentRows.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, data.pagination.totalFiltered)}</span> of <span className="text-foreground">{data.pagination.totalFiltered}</span> students
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-fade-in stagger-3">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Major</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">GPA</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.studentRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No students found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    data.studentRows.map((student, index) => (
                      <tr 
                        key={student.studentId} 
                        className="table-row-hover cursor-pointer"
                        style={{ animationDelay: `${index * 20}ms` }}
                      >
                        <td className="px-6 py-4">
                          <Link to={`/advisor/student/${student.studentId}/notes`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">{student.name}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.major}</td>
                        <td className="px-6 py-4">
                          <RiskBadge level={student.riskTier} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-medium text-foreground">{student.riskScore}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${student.termGpa >= 3.0 ? 'text-success' : student.termGpa >= 2.0 ? 'text-amber-600' : 'text-destructive'}`}>
                            {student.termGpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  student.attendancePct >= 80 ? 'bg-success' : 
                                  student.attendancePct >= 60 ? 'bg-amber-500' : 'bg-destructive'
                                }`}
                                style={{ width: `${student.attendancePct}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">{student.attendancePct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={pageSize.toString()} onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20 h-9 rounded-lg">
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
                <span className="text-sm text-muted-foreground mr-2">
                  Page {data.pagination.currentPage} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={currentPage === data.pagination.totalPages}
                  className="rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(data.pagination.totalPages)}
                  disabled={currentPage === data.pagination.totalPages}
                  className="rounded-lg"
                >
                  Last
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
