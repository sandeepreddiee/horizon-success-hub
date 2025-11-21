import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const mockInterventions = [
  { id: 1, studentId: 1, studentName: "Aarav Patel", intervention: "Scheduled tutoring sessions for Data Structures", date: "2024-11-18T10:00:00Z", advisorName: "Dr. Sarah Smith" },
  { id: 2, studentId: 5, studentName: "Mei Chen", intervention: "Referred to academic counseling for time management", date: "2024-11-17T14:30:00Z", advisorName: "Dr. Sarah Smith" },
  { id: 3, studentId: 8, studentName: "Lucas Brown", intervention: "Set up weekly check-ins to monitor attendance", date: "2024-11-16T09:00:00Z", advisorName: "Dr. Sarah Smith" },
  { id: 4, studentId: 3, studentName: "Daniel Owusu", intervention: "Connected with study group for Business Analytics", date: "2024-11-15T15:00:00Z", advisorName: "Dr. Sarah Smith" },
];

const AdvisorInterventions = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Interventions & Notes</h1>
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
            {mockInterventions.map((intervention) => (
              <Link
                key={intervention.id}
                to={`/advisor/student/${intervention.studentId}/notes`}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{intervention.studentName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(intervention.date), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{intervention.intervention}</p>
                    <p className="text-xs text-muted-foreground">By {intervention.advisorName}</p>
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

export default AdvisorInterventions;
