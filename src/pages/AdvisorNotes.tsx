import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { LogOut, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Note {
  noteId: number;
  content: string;
  timestamp: string;
  advisorName: string;
}

const AdvisorNotes = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!studentId) return;

      try {
        const response = await advisorAPI.getNotes(parseInt(studentId));
        setNotes(response.data.notes);
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

    fetchNotes();
  }, [studentId, toast]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !studentId) return;

    setIsSaving(true);
    try {
      await advisorAPI.addNote(parseInt(studentId), newNote);
      
      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      });

      // Refresh notes
      const response = await advisorAPI.getNotes(parseInt(studentId));
      setNotes(response.data.notes);
      setNewNote("");
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/advisor/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Student Notes & Interventions</h1>
        </div>
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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        ) : (
          <>
            {/* Add New Note */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Add New Note</h3>
              <Textarea
                placeholder="Enter your note or intervention details..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <Button onClick={handleAddNote} disabled={isSaving || !newNote.trim()}>
                {isSaving ? "Saving..." : "Save Note"}
              </Button>
            </div>

            {/* Notes History */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Notes History</h3>
              {notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No notes yet for this student.</p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.noteId} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{note.advisorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(note.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.content}</p>
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
