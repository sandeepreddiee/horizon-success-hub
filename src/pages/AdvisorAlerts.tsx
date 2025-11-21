import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, AlertTriangle, TrendingDown, Calendar } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { Link } from "react-router-dom";

const mockAlerts = [
  { id: 1, studentId: 1, studentName: "Aarav Patel", type: "attendance", message: "Attendance dropped to 75%", severity: "High" as "High", date: "2024-11-20" },
  { id: 2, studentId: 5, studentName: "Mei Chen", type: "gpa", message: "GPA fell below 2.5 threshold", severity: "High" as "High", date: "2024-11-19" },
  { id: 3, studentId: 3, studentName: "Daniel Owusu", type: "engagement", message: "No LMS activity in 7 days", severity: "Medium" as "Medium", date: "2024-11-18" },
  { id: 4, studentId: 8, studentName: "Lucas Brown", type: "attendance", message: "Missed 3 consecutive classes", severity: "High" as "High", date: "2024-11-17" },
  { id: 5, studentId: 6, studentName: "James Wilson", type: "deadline", message: "Multiple assignment deadlines approaching", severity: "Medium" as "Medium", date: "2024-11-16" },
];

const AdvisorAlerts = () => {
  const { logout } = useAuth();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Calendar className="w-5 h-5" />;
      case "gpa":
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Risk Alerts</h1>
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
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <Link
                key={alert.id}
                to={`/advisor/student/${alert.studentId}/notes`}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    alert.severity === "High" ? "bg-destructive/10 text-destructive" : "bg-yellow-500/10 text-yellow-600"
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{alert.studentName}</h3>
                      <RiskBadge level={alert.severity} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorAlerts;
