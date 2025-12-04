import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { advisorAPI } from "@/services/api";
import { interventionStore } from "@/services/interventionStore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { LogOut, Users, ArrowLeft, Calendar, FileText, MessageSquare, BookOpen } from "lucide-react";
import { loadStudents } from "@/services/dataLoader";

interface Note {
  noteId: number;
  content: string;
  timestamp: string;
  type?: string;
}

const AdvisorNotes = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [studentInfo, setStudentInfo] = useState<{ name: string; major: string; riskTier: "High" | "Medium" | "Low" } | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<string>("note");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;

      try {
        // Fetch notes
        const response = await advisorAPI.getNotes(parseInt(studentId));
        setNotes(response.data.notes);
        
        // Fetch student info for intervention store
        const students = await loadStudents();
        const student = students.find(s => s.student_id === parseInt(studentId));
        if (student) {
          // Calculate risk tier
          const gpa = student.cumulative_gpa;
          let riskTier: "High" | "Medium" | "Low" = "Low";
          if (gpa < 2.0) riskTier = "High";
          else if (gpa < 2.5) riskTier = "Medium";
          
          setStudentInfo({
            name: student.name,
            major: student.major,
            riskTier
          });
        }
      } catch (error: any) {
        console.error("Error loading notes:", error);
        toast({
          title: "Error loading notes",
          description: error.response?.data?.message || error.message || "Failed to load notes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId, toast]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !studentId || !studentInfo) return;

    setIsSaving(true);

    try {
      await advisorAPI.addNote(parseInt(studentId), newNote);
      
      // Add to intervention store for syncing with Interventions page
      interventionStore.add({
        studentId: parseInt(studentId),
        studentName: studentInfo.name,
        major: studentInfo.major,
        riskTier: studentInfo.riskTier,
        content: newNote,
        date: new Date(),
        type: noteType as any
      });
      
      toast({
        title: "Intervention added",
        description: "Your note has been saved and synced.",
      });

      // Refresh notes
      const response = await advisorAPI.getNotes(parseInt(studentId));
      setNotes(response.data.notes);
      setNewNote("");
      setNoteType("note");
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast({
        title: "Error adding note",
        description: error.response?.data?.message || error.message || "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Calendar className="w-4 h-4" />;
      case "tutoring": return <BookOpen className="w-4 h-4" />;
      case "referral": return <FileText className="w-4 h-4" />;
      case "check-in": return <MessageSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "meeting": return "Meeting";
      case "tutoring": return "Tutoring";
      case "referral": return "Referral";
      case "check-in": return "Check-in";
      default: return "Note";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/advisor/students" 
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                {studentInfo?.name || "Student"} - Interventions
              </h1>
              <p className="text-sm text-muted-foreground">
                {studentInfo?.major || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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

      <div className="p-8 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            {/* Add New Intervention */}
            <div className="card-premium p-6 mb-8 animate-fade-in">
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">Add New Intervention</h3>
              
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Intervention Type
                </label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="w-full rounded-xl input-premium">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>General Note</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="meeting">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Meeting</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tutoring">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Tutoring Session</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="referral">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Referral</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="check-in">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Check-in</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Enter intervention details, meeting notes, or observations..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="mb-4 rounded-xl input-premium"
              />
              <Button 
                onClick={handleAddNote} 
                disabled={isSaving || !newNote.trim()} 
                className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
              >
                {isSaving ? "Saving..." : "Save Intervention"}
              </Button>
            </div>

            {/* Notes History */}
            <div className="card-premium p-6 animate-fade-in stagger-1">
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">
                Intervention History
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({notes.length} record{notes.length !== 1 ? 's' : ''})
                </span>
              </h3>
              {notes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No interventions recorded yet for this student.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div 
                      key={note.noteId} 
                      className="border border-border rounded-xl p-4 bg-background hover:border-primary/30 transition-all"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            {getTypeIcon(note.type || 'note')}
                          </div>
                          <span className="text-xs font-medium text-primary uppercase tracking-wide">
                            {getTypeLabel(note.type || 'note')}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(note.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdvisorNotes;
