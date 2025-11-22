import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const AdvisorReports = () => {
  const { logout } = useAuth();

  // Mock data based on real dataset - Risk Distribution from riskscores table
  const riskDistributionData = [
    { name: "High Risk", value: 74, percentage: 1.5 },
    { name: "Medium Risk", value: 1995, percentage: 39.9 },
    { name: "Low Risk", value: 2931, percentage: 58.6 },
  ];

  // Mock data based on real dataset - GPA Distribution from term_gpas table
  const gpaDistributionData = [
    { range: "0.0-1.0", count: 12 },
    { range: "1.0-2.0", count: 342 },
    { range: "2.0-2.5", count: 876 },
    { range: "2.5-3.0", count: 1654 },
    { range: "3.0-3.5", count: 1489 },
    { range: "3.5-4.0", count: 627 },
  ];

  const COLORS = {
    high: "hsl(var(--risk-high))",
    medium: "hsl(var(--risk-medium))",
    low: "hsl(var(--risk-low))",
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Reports & Insights</h1>
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
          {/* Summary Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Term Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Students" value="5000" />
              <StatCard title="Average Term GPA" value="2.81" />
              <StatCard title="Average Attendance" value="77.5%" />
              <StatCard title="High Risk Students" value="74" trend="danger" />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Risk Distribution Chart */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Student Risk Distribution</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Breakdown of students by risk level. This overview helps prioritize advising resources and identify which student populations need more support.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.name === "High Risk" ? COLORS.high :
                          entry.name === "Medium Risk" ? COLORS.medium :
                          COLORS.low
                        } 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This chart shows the distribution of students across risk tiers based on their risk scores (0-100). 
                  High-risk students (1.5%) require immediate intervention, while medium-risk students (39.9%) need 
                  regular monitoring. The majority (58.6%) are low-risk, performing well academically.
                </p>
              </div>
            </div>

            {/* GPA Distribution Chart */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Term GPA Distribution</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how students are distributed across GPA ranges. This helps identify if most students are performing well or if intervention is needed for specific groups.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gpaDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="range" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'Students', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => [`${value} students`, 'Count']}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This histogram displays how student GPAs are distributed across different ranges for the current term. 
                  Most students cluster in the 2.5-3.0 range (1,654 students), indicating moderate overall performance. 
                  Students below 2.0 (1,230 total) should be prioritized for academic support interventions.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Key Insights & Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Focus on High-Risk Students</p>
                  <p className="text-sm text-muted-foreground">
                    74 students are in the high-risk category. Prioritize one-on-one meetings and academic support resources 
                    for these students to prevent potential dropouts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">GPA Distribution Concerns</p>
                  <p className="text-sm text-muted-foreground">
                    1,230 students have GPAs below 2.0. Consider implementing peer tutoring programs and study skills workshops 
                    to help these students improve their academic performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Monitor Medium-Risk Students</p>
                  <p className="text-sm text-muted-foreground">
                    1,995 students in medium-risk category need regular check-ins to prevent escalation. 
                    Automated alerts based on attendance and LMS engagement can help identify early warning signs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorReports;
