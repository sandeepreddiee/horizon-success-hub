import { useState, useEffect } from "react";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, AlertTriangle, TrendingDown, Calendar, Activity } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  studentId: number;
  studentName: string;
  major: string;
  type: "gpa" | "attendance" | "risk";
  message: string;
  severity: "High" | "Medium" | "Low";
  riskScore: number;
}

const AdvisorAlerts = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await advisorAPI.getDashboard(1, 5000, "all", "all");
        const students = response.data.studentRows;
        
        // Generate alerts based on real data
        const generatedAlerts: Alert[] = [];
        
        students.forEach(student => {
          // High risk students
          if (student.riskTier === "High") {
            if (student.termGpa < 2.0) {
              generatedAlerts.push({
                id: `gpa-${student.studentId}`,
                studentId: student.studentId,
                studentName: student.name,
                major: student.major,
                type: "gpa",
                message: `GPA critically low at ${student.termGpa.toFixed(2)} - immediate intervention needed`,
                severity: "High",
                riskScore: student.riskScore
              });
            }
            if (student.attendancePct < 75) {
              generatedAlerts.push({
                id: `attendance-${student.studentId}`,
                studentId: student.studentId,
                studentName: student.name,
                major: student.major,
                type: "attendance",
                message: `Attendance dropped to ${student.attendancePct}% - pattern of absences detected`,
                severity: "High",
                riskScore: student.riskScore
              });
            }
            generatedAlerts.push({
              id: `risk-${student.studentId}`,
              studentId: student.studentId,
              studentName: student.name,
              major: student.major,
              type: "risk",
              message: `High risk score of ${student.riskScore} - requires monitoring`,
              severity: "High",
              riskScore: student.riskScore
            });
          }
          
          // Medium risk alerts
          if (student.riskTier === "Medium" && student.termGpa < 2.5) {
            generatedAlerts.push({
              id: `gpa-med-${student.studentId}`,
              studentId: student.studentId,
              studentName: student.name,
              major: student.major,
              type: "gpa",
              message: `GPA at ${student.termGpa.toFixed(2)} - approaching risk threshold`,
              severity: "Medium",
              riskScore: student.riskScore
            });
          }
        });
        
        // Sort by severity and risk score
        generatedAlerts.sort((a, b) => {
          if (a.severity === "High" && b.severity !== "High") return -1;
          if (a.severity !== "High" && b.severity === "High") return 1;
          return b.riskScore - a.riskScore;
        });
        
        setAlerts(generatedAlerts);
      } catch (error: any) {
        toast({
          title: "Error loading alerts",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [toast]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Calendar className="w-5 h-5" />;
      case "gpa":
        return <TrendingDown className="w-5 h-5" />;
      case "risk":
        return <Activity className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredAlerts = severityFilter === "all" 
    ? alerts 
    : alerts.filter(a => a.severity.toLowerCase() === severityFilter);

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Risk Alerts</h1>
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="high">High Severity</SelectItem>
                  <SelectItem value="medium">Medium Severity</SelectItem>
                  <SelectItem value="low">Low Severity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading alerts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={`/advisor/student/${alert.studentId}/notes`}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all hover:border-primary/50 block"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      alert.severity === "High" ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-heading font-semibold text-foreground">{alert.studentName}</h3>
                          <p className="text-xs text-muted-foreground">{alert.major}</p>
                        </div>
                        <RiskBadge level={alert.severity} />
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No alerts found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorAlerts;
