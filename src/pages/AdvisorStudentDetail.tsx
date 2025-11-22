import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ArrowLeft, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RiskBadge from "@/components/RiskBadge";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { loadStudents, loadAttendance, calculateAverageAttendance, loadEnrollments, loadEnrollmentGrades, loadCourses, gradeToLetter } from "@/services/dataLoader";
import { calculateRisk } from "@/lib/riskCalculation";

interface Note {
  noteId: number;
  content: string;
  timestamp: string;
}

interface StudentDetail {
  studentId: number;
  name: string;
  major: string;
  riskTier: "High" | "Medium" | "Low";
  riskScore: number;
  termGpa: number;
  cumulativeGpa: number;
  attendancePct: number;
  creditsCompleted: number;
  age: number;
  gender: string;
  residencyStatus: string;
  firstGen: boolean;
}

interface Course {
  courseName: string;
  credits: number;
  grade: string;
}

const AdvisorStudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;
      
      setIsLoading(true);
      try {
        const sid = parseInt(studentId);
        
        // Load student data
        const students = await loadStudents();
        const attendance = await loadAttendance();
        const enrollments = await loadEnrollments();
        const enrollmentGrades = await loadEnrollmentGrades();
        const coursesData = await loadCourses();
        
        const studentData = students.find(s => s.student_id === sid);
        if (!studentData) throw new Error("Student not found");
        
        const avgAttendance = calculateAverageAttendance(attendance, sid);
        const risk = calculateRisk(studentData.cumulative_gpa, avgAttendance);
        
        // Get courses
        const studentEnrollments = enrollments.filter(e => e.student_id === sid && e.term_id === 1);
        const studentCourses = studentEnrollments.map(enrollment => {
          const course = coursesData.find(c => c.course_id === enrollment.course_id);
          const grade = enrollmentGrades.find(g => 
            g.student_id === sid && 
            g.course_id === enrollment.course_id && 
            g.term_id === 1
          );
          
          const credits = course ? Math.floor(course.level / 100) + 2 : 3;
          
          return {
            courseName: course?.title || "Unknown Course",
            credits,
            grade: grade ? gradeToLetter(grade.course_gpa) : "N/A"
          };
        });
        
        setStudent({
          studentId: sid,
          name: studentData.name,
          major: studentData.major,
          riskTier: risk.riskTier,
          riskScore: risk.riskScore,
          termGpa: studentData.cumulative_gpa,
          cumulativeGpa: studentData.cumulative_gpa,
          attendancePct: avgAttendance,
          creditsCompleted: studentData.credits_completed,
          age: studentData.age,
          gender: studentData.gender,
          residencyStatus: studentData.residency_status,
          firstGen: studentData.first_gen === 1
        });
        
        setCourses(studentCourses);
        
        // Load notes
        const notesResponse = await advisorAPI.getNotes(sid);
        setNotes(notesResponse.data.notes);
      } catch (error: any) {
        toast({
          title: "Error loading student data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, toast]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !studentId) return;
    
    setIsSaving(true);
    try {
      await advisorAPI.addNote(parseInt(studentId), newNote);
      toast({
        title: "Success",
        description: "Note saved successfully"
      });
      
      // Reload notes
      const notesResponse = await advisorAPI.getNotes(parseInt(studentId));
      setNotes(notesResponse.data.notes);
      setNewNote("");
    } catch (error: any) {
      toast({
        title: "Error saving note",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdvisorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdvisorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/advisor/students">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-heading font-semibold text-foreground">{student.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
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
          {/* Student Overview Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Major</p>
                  <p className="font-semibold text-foreground">{student.major}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cumulative GPA</p>
                  <p className="font-semibold text-foreground">{student.cumulativeGpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credits Completed</p>
                  <p className="font-semibold text-foreground">{student.creditsCompleted}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Risk Status</p>
                  <RiskBadge level={student.riskTier} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="notes">Intervention Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="text-foreground">{student.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="text-foreground">{student.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Residency Status</p>
                      <p className="text-foreground">{student.residencyStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">First Generation</p>
                      <p className="text-foreground">{student.firstGen ? "Yes" : "No"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="text-foreground">{student.riskScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Attendance</p>
                      <p className="text-foreground">{student.attendancePct}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Term GPA</p>
                      <p className="text-foreground">{student.termGpa.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Current Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                        <div>
                          <p className="font-semibold text-foreground">{course.courseName}</p>
                          <p className="text-sm text-muted-foreground">{course.credits} credits</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{course.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter intervention note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mb-4"
                    rows={4}
                  />
                  <Button onClick={handleAddNote} disabled={isSaving || !newNote.trim()}>
                    {isSaving ? "Saving..." : "Save Note"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intervention History</CardTitle>
                </CardHeader>
                <CardContent>
                  {notes.length === 0 ? (
                    <p className="text-muted-foreground">No notes yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div key={note.noteId} className="border-b border-border pb-4 last:border-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(note.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <p className="text-foreground">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvisorStudentDetail;
