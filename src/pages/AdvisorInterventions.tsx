import { useState, useEffect, useCallback } from "react";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, FileText, Calendar, MessageSquare, BookOpen, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { format, isToday, isYesterday, isThisWeek, startOfDay } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import RiskBadge from "@/components/RiskBadge";
import { advisorAPI } from "@/services/api";
import { interventionStore, InterventionRecord } from "@/services/interventionStore";
import { useToast } from "@/hooks/use-toast";

const AdvisorInterventions = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const loadInterventions = useCallback(() => {
    setInterventions(interventionStore.getAll());
  }, []);

  useEffect(() => {
    const initializeInterventions = async () => {
      try {
        const response = await advisorAPI.getDashboard(1, 5000, "all", "all");
        const students = response.data.studentRows;
        
        // Generate initial interventions for high and medium risk students
        const generatedInterventions: InterventionRecord[] = [];
        const interventionTypes: Array<{ type: InterventionRecord['type']; text: string }> = [
          { type: "meeting", text: "Scheduled academic check-in meeting to discuss progress" },
          { type: "referral", text: "Referred to academic counseling for study strategies" },
          { type: "tutoring", text: "Arranged tutoring sessions for challenging courses" },
          { type: "check-in", text: "Weekly progress monitoring initiated" },
        ];
        
        students.filter(s => s.riskTier !== "Low").slice(0, 50).forEach((student, index) => {
          const interventionType = interventionTypes[index % interventionTypes.length];
          const daysAgo = Math.floor(Math.random() * 7); // 0-7 days ago (more recent)
          
          generatedInterventions.push({
            id: `intervention-${student.studentId}-init`,
            studentId: student.studentId,
            studentName: student.name,
            major: student.major,
            riskTier: student.riskTier,
            content: interventionType.text,
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
            type: interventionType.type
          });
        });
        
        // Add some "today" interventions for demo
        const todayStudents = students.filter(s => s.riskTier === "High").slice(0, 3);
        todayStudents.forEach((student, index) => {
          const types: InterventionRecord['type'][] = ["meeting", "check-in", "note"];
          generatedInterventions.push({
            id: `intervention-${student.studentId}-today`,
            studentId: student.studentId,
            studentName: student.name,
            major: student.major,
            riskTier: student.riskTier,
            content: index === 0 
              ? "Emergency academic intervention meeting conducted" 
              : index === 1 
              ? "Progress check-in completed - showing improvement"
              : "Added to priority monitoring list",
            date: new Date(),
            type: types[index]
          });
        });
        
        // Initialize store with generated data
        interventionStore.initialize(generatedInterventions);
        loadInterventions();
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

    initializeInterventions();
    
    // Subscribe to store changes
    const unsubscribe = interventionStore.subscribe(loadInterventions);
    return () => unsubscribe();
  }, [toast, loadInterventions]);

  // Filter interventions
  const filteredInterventions = interventions.filter(intervention => {
    // Type filter
    if (typeFilter !== "all" && intervention.type !== typeFilter) return false;
    
    // Date filter
    if (dateFilter !== "all") {
      const interventionDate = new Date(intervention.date);
      switch (dateFilter) {
        case "today":
          if (!isToday(interventionDate)) return false;
          break;
        case "yesterday":
          if (!isYesterday(interventionDate)) return false;
          break;
        case "week":
          if (!isThisWeek(interventionDate)) return false;
          break;
      }
    }
    
    return true;
  });

  const todaysCount = interventions.filter(i => isToday(new Date(i.date))).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Calendar className="w-5 h-5" />;
      case "tutoring": return <BookOpen className="w-5 h-5" />;
      case "check-in": return <MessageSquare className="w-5 h-5" />;
      case "referral": return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "meeting": return "Meeting";
      case "tutoring": return "Tutoring";
      case "check-in": return "Check-in";
      case "referral": return "Referral";
      default: return "Note";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-primary/10 text-primary";
      case "tutoring": return "bg-secondary/10 text-secondary";
      case "check-in": return "bg-success/10 text-success";
      case "referral": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Interventions & Notes</h1>
              <p className="text-sm text-muted-foreground mt-1">Track and manage student interventions</p>
            </div>
            <div className="flex items-center gap-3">
              {todaysCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{todaysCount} today</span>
                </div>
              )}
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

        <div className="p-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-card rounded-2xl p-5 border border-border shadow-sm animate-fade-in">
            <div className="flex flex-wrap gap-3">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-44 rounded-xl input-premium">
                  <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-44 rounded-xl input-premium">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="referral">Referrals</SelectItem>
                  <SelectItem value="check-in">Check-ins</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              <span className="text-foreground">{filteredInterventions.length}</span> intervention{filteredInterventions.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading interventions...</p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in stagger-1">
              {filteredInterventions.map((intervention, index) => (
                <Link
                  key={intervention.id}
                  to={`/advisor/student/${intervention.studentId}/notes`}
                  className="card-premium p-5 block group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getTypeColor(intervention.type)} transition-transform group-hover:scale-110`}>
                      {getTypeIcon(intervention.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                            {intervention.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-heading font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {intervention.studentName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">{intervention.major}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <RiskBadge level={intervention.riskTier} showIcon={false} />
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(intervention.type)}`}>
                              {getTypeLabel(intervention.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground/80 mb-2 line-clamp-2">{intervention.content}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {isToday(new Date(intervention.date)) 
                            ? `Today at ${format(new Date(intervention.date), "h:mm a")}`
                            : isYesterday(new Date(intervention.date))
                            ? `Yesterday at ${format(new Date(intervention.date), "h:mm a")}`
                            : format(new Date(intervention.date), "MMM dd, yyyy 'at' h:mm a")
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredInterventions.length === 0 && (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">No interventions found</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filters</p>
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
