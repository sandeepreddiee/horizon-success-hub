import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import StatCard from "@/components/StatCard";

const AdvisorReports = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Reports & Insights</h1>
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
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Term Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Retention Rate" value="94%" trend="success" />
              <StatCard title="Average GPA" value="3.15" />
              <StatCard title="Avg Attendance" value="86%" trend="danger" />
              <StatCard title="Interventions" value="47" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-sm text-muted-foreground">High Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">18 students (15%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-muted-foreground">Medium Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">42 students (34%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-muted-foreground">Low Risk</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">64 students (51%)</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trend Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Attendance</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-semibold text-destructive">-3% from last term</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average GPA</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-500">+0.12 from last term</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Score</span>
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">No change</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top At-Risk Factors</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Low Attendance</span>
                <span className="text-sm font-semibold text-foreground">23 students</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Declining GPA</span>
                <span className="text-sm font-semibold text-foreground">18 students</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Low Engagement</span>
                <span className="text-sm font-semibold text-foreground">15 students</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Financial Concerns</span>
                <span className="text-sm font-semibold text-foreground">8 students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorReports;
