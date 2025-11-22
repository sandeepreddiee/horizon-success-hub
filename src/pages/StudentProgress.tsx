import { useEffect, useState } from "react";
import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { studentAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface TermGPA {
  term: string;
  gpa: number;
}

const StudentProgress = () => {
  const { logout, studentId } = useAuth();
  const { toast } = useToast();
  const [termGpas, setTermGpas] = useState<TermGPA[]>([]);
  const [cumulativeGpa, setCumulativeGpa] = useState(0);
  const [creditsCompleted, setCreditsCompleted] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [riskTier, setRiskTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;
      
      try {
        const response = await studentAPI.getDashboard(studentId);
        setTermGpas(response.data.termGpas || []);
        setCumulativeGpa(response.data.cumulativeGpa);
        setCreditsCompleted(response.data.creditsCompleted);
        setAverageAttendance(response.data.averageAttendance);
        setRiskTier(response.data.riskTier);
      } catch (error: any) {
        console.error("Progress error:", error);
        toast({
          title: "Error loading progress",
          description: error.message,
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
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate GPA trend
  const gpaTrend = termGpas.length >= 2 
    ? termGpas[termGpas.length - 1].gpa - termGpas[termGpas.length - 2].gpa 
    : 0;

  // Calculate degree progress (assuming 120 credits needed)
  const degreeProgress = (creditsCompleted / 120) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">My Progress</h1>
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
          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Cumulative GPA</span>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground">{cumulativeGpa.toFixed(2)}</p>
              {gpaTrend !== 0 && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  gpaTrend > 0 ? 'text-green-600' : 'text-destructive'
                }`}>
                  {gpaTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(gpaTrend).toFixed(2)} from last term</span>
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Credits Completed</span>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground">{creditsCompleted}</p>
              <p className="text-xs text-muted-foreground mt-2">of 120 required</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Degree Progress</span>
              </div>
              <p className="text-3xl font-heading font-bold text-foreground">{degreeProgress.toFixed(0)}%</p>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div 
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(degreeProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Risk Status</span>
              </div>
              <p className={`text-3xl font-heading font-bold ${
                riskTier === 'Low' ? 'text-green-600' :
                riskTier === 'Medium' ? 'text-yellow-600' : 'text-destructive'
              }`}>
                {riskTier || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Attendance: {averageAttendance.toFixed(1)}%</p>
            </div>
          </div>

          {/* Semester Performance Chart */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-8">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-6">Term GPA Trend</h3>
            {termGpas.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={termGpas}>
                  <defs>
                    <linearGradient id="colorGpaProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="term" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 4.0]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#colorGpaProgress)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p className="text-sm">No GPA data available</p>
              </div>
            )}
          </div>

          {/* Performance Insights */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Performance Insights</h3>
            <div className="space-y-4">
              {cumulativeGpa >= 3.5 && (
                <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Excellent Academic Performance</p>
                    <p className="text-xs text-muted-foreground mt-1">Your GPA is above 3.5 - keep up the great work!</p>
                  </div>
                </div>
              )}
              
              {cumulativeGpa < 3.0 && cumulativeGpa >= 2.5 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Room for Improvement</p>
                    <p className="text-xs text-muted-foreground mt-1">Consider utilizing tutoring services and meeting with your advisor.</p>
                  </div>
                </div>
              )}

              {cumulativeGpa < 2.5 && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Academic Support Needed</p>
                    <p className="text-xs text-muted-foreground mt-1">Please schedule a meeting with your advisor to discuss support resources.</p>
                  </div>
                </div>
              )}

              {gpaTrend > 0.1 && (
                <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">Positive Trend</p>
                    <p className="text-xs text-muted-foreground mt-1">Your GPA has improved by {gpaTrend.toFixed(2)} points since last term!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
