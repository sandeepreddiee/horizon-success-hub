import { useState } from "react";
import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, BookOpen, Clock, MapPin, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockCourses = [
  {
    id: 1,
    name: "Data Structures",
    code: "CS 301",
    credits: 4,
    grade: "B+",
    instructor: "Dr. Smith",
    schedule: "MWF 10:00-11:00 AM",
    location: "Room 204",
    progress: 75
  },
  {
    id: 2,
    name: "Web Development",
    code: "CS 220",
    credits: 3,
    grade: "A-",
    instructor: "Prof. Johnson",
    schedule: "TTh 2:00-3:30 PM",
    location: "Room 301",
    progress: 82
  },
  {
    id: 3,
    name: "Database Systems",
    code: "CS 315",
    credits: 3,
    grade: "B",
    instructor: "Dr. Williams",
    schedule: "MWF 1:00-2:00 PM",
    location: "Room 150",
    progress: 68
  },
  {
    id: 4,
    name: "Software Engineering",
    code: "CS 420",
    credits: 4,
    grade: "A",
    instructor: "Prof. Davis",
    schedule: "TTh 10:00-11:30 AM",
    location: "Room 210",
    progress: 90
  },
];

const StudentCourses = () => {
  const { logout } = useAuth();

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
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="current">Current Semester</TabsTrigger>
              <TabsTrigger value="completed">Completed Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockCourses.map((course) => (
                  <div key={course.id} className="bg-card rounded-lg border border-border p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.code} • {course.credits} Credits</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.grade.startsWith('A') ? 'bg-green-500/10 text-green-600' :
                        course.grade.startsWith('B') ? 'bg-primary/10 text-primary' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {course.grade}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{course.location}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="font-semibold text-foreground">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Completed Courses</h3>
                <p className="text-sm text-muted-foreground">
                  Your completed courses history will appear here
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;
