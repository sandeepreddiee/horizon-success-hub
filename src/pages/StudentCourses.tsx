import { useEffect, useState } from "react";
import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, BookOpen, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studentAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Course {
  courseName: string;
  credits: number;
  grade: string;
  numericGrade: number;
  courseGpa: number;
}

interface AttendanceByCourse {
  courseName: string;
  percentage: number;
}

const StudentCourses = () => {
  const { logout, studentId } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<AttendanceByCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;
      
      try {
        const response = await studentAPI.getDashboard(studentId);
        setCourses(response.data.courses || []);
        setAttendance(response.data.attendanceByCourse || []);
      } catch (error: any) {
        console.error("Courses error:", error);
        toast({
          title: "Error loading courses",
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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-destructive';
  };

  const getAttendanceForCourse = (courseName: string) => {
    const courseAttendance = attendance.find(a => a.courseName === courseName);
    return courseAttendance?.percentage || 0;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">My Courses</h1>
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
          {/* Course Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Courses</p>
              <p className="text-3xl font-heading font-bold text-foreground">{courses.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Credits</p>
              <p className="text-3xl font-heading font-bold text-foreground">
                {courses.reduce((sum, c) => sum + c.credits, 0)}
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Average Grade</p>
              <p className="text-3xl font-heading font-bold text-foreground">
                {courses.length > 0 
                  ? (courses.reduce((sum, c) => sum + c.courseGpa, 0) / courses.length).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>

          {/* Course List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.length > 0 ? (
              courses.map((course, index) => {
                const attendancePct = getAttendanceForCourse(course.courseName);
                return (
                  <div key={index} className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{course.courseName}</h3>
                        <p className="text-sm text-muted-foreground">{course.credits} Credits</p>
                      </div>
                      <span className={`text-2xl font-heading font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Grade Info */}
                      <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                        <span className="text-sm text-muted-foreground">Course GPA</span>
                        <span className="text-sm font-semibold text-foreground">{course.courseGpa.toFixed(2)}</span>
                      </div>

                      {/* Numeric Grade */}
                      <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                        <span className="text-sm text-muted-foreground">Numeric Grade</span>
                        <span className="text-sm font-semibold text-foreground">{course.numericGrade.toFixed(1)}</span>
                      </div>

                      {/* Attendance */}
                      {attendancePct > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Attendance</span>
                            <span className={`text-sm font-semibold ${
                              attendancePct >= 90 ? 'text-green-600' :
                              attendancePct >= 75 ? 'text-yellow-600' : 'text-destructive'
                            }`}>
                              {attendancePct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`rounded-full h-2 transition-all ${
                                attendancePct >= 90 ? 'bg-green-600' :
                                attendancePct >= 75 ? 'bg-yellow-600' : 'bg-destructive'
                              }`}
                              style={{ width: `${Math.min(attendancePct, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 bg-card rounded-lg border border-border p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Found</h3>
                <p className="text-sm text-muted-foreground">
                  Course enrollment data will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
