import { useState } from "react";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import RiskBadge from "@/components/RiskBadge";
import { Link } from "react-router-dom";

// Mock data using ONLY valid dataset fields
const mockStudents = [
  { studentId: 1, name: "Aarav Patel", major: "Computer Science", riskTier: "High" as "High" },
  { studentId: 2, name: "Emily Nguyen", major: "Biology", riskTier: "Low" as "Low" },
  { studentId: 3, name: "Daniel Owusu", major: "Business Admin", riskTier: "Medium" as "Medium" },
  { studentId: 4, name: "Sofia Martinez", major: "Art History", riskTier: "Low" as "Low" },
  { studentId: 5, name: "Mei Chen", major: "Engineering", riskTier: "High" as "High" },
  { studentId: 6, name: "James Wilson", major: "Psychology", riskTier: "Medium" as "Medium" },
  { studentId: 7, name: "Fatima Hassan", major: "Computer Science", riskTier: "Low" as "Low" },
  { studentId: 8, name: "Lucas Brown", major: "Engineering", riskTier: "High" as "High" },
];

const AdvisorStudents = () => {
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">My Students</h1>
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
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search students by name or major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Link
                key={student.studentId}
                to={`/advisor/student/${student.studentId}/notes`}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.major}</p>
                  </div>
                  <RiskBadge level={student.riskTier} />
                </div>
              </Link>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorStudents;
