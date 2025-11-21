import { useState, useEffect } from "react";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RiskBadge from "@/components/RiskBadge";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Intervention {
  id: string;
  studentId: number;
  studentName: string;
  major: string;
  riskTier: "High" | "Medium" | "Low";
  intervention: string;
  date: Date;
  type: "meeting" | "referral" | "check-in" | "tutoring";
}

const AdvisorInterventions = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await advisorAPI.getDashboard(1, 5000, "all", "all");
        const students = response.data.studentRows;
        
        // Generate interventions for high and medium risk students
        const generatedInterventions: Intervention[] = [];
        const interventionTypes = [
          { type: "meeting" as const, text: "Scheduled academic check-in meeting to discuss progress" },
          { type: "referral" as const, text: "Referred to academic counseling for study strategies" },
          { type: "tutoring" as const, text: "Arranged tutoring sessions for challenging courses" },
          { type: "check-in" as const, text: "Weekly progress monitoring initiated" },
        ];
        
        students.filter(s => s.riskTier !== "Low").forEach((student, index) => {
          const interventionType = interventionTypes[index % interventionTypes.length];
          const daysAgo = Math.floor(Math.random() * 14) + 1;
          
          generatedInterventions.push({
            id: `intervention-${student.studentId}`,
            studentId: student.studentId,
            studentName: student.name,
            major: student.major,
            riskTier: student.riskTier,
            intervention: interventionType.text,
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            type: interventionType.type
          });
        });
        
        // Sort by date (most recent first)
        generatedInterventions.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        setInterventions(generatedInterventions.slice(0, 100)); // Show last 100
      } catch (error: any) {
        toast({
          title: "Error loading interventions",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterventions();
  }, [toast]);

  const filteredInterventions = typeFilter === "all"
    ? interventions
    : interventions.filter(i => i.type === typeFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Calendar className="w-5 h-5" />;
      case "tutoring":
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Interventions & Notes</h1>
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
                <SelectItem value="check-in">Check-ins</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredInterventions.length} intervention{filteredInterventions.length !== 1 ? 's' : ''} recorded
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading interventions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInterventions.map((intervention) => (
                <Link
                  key={intervention.id}
                  to={`/advisor/student/${intervention.studentId}/notes`}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all hover:border-primary/50 block"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {getTypeIcon(intervention.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-heading font-semibold text-foreground">{intervention.studentName}</h3>
                          <RiskBadge level={intervention.riskTier} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(intervention.date, "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{intervention.major}</p>
                      <p className="text-sm text-foreground">{intervention.intervention}</p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredInterventions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No interventions found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorInterventions;
