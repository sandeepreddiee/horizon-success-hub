import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import RiskBadge from "@/components/RiskBadge";
import { advisorAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentInfo {
  id: number;
  name: string;
  major: string;
  year: string;
  riskTier: "High" | "Medium" | "Low";
  termGpa: number;
  attendance: number;
  engagement: number;
}

interface Note {
  date: string;
  type: string;
  description: string;
}

interface NotesPageData {
  student: StudentInfo;
  notes: Note[];
}

const AdvisorNotes = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [data, setData] = useState<NotesPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteType, setNoteType] = useState("advising_meeting");
  const [termId] = useState(1);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!studentId) return;

    try {
      const response = await advisorAPI.getNotesPage(parseInt(studentId), termId);
      setData(response.data);
    } catch (error: any) {
      console.error("Notes error:", error);
      toast({
        title: "Error loading notes",
        description: error.response?.data?.message || error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const handleAddNote = async () => {
    if (!studentId) return;

    try {
      await advisorAPI.addNote(parseInt(studentId), termId, noteType);
      toast({
        title: "Note added",
        description: "Intervention note has been recorded successfully",
      });
      fetchData();
    } catch (error: any) {
      console.error("Add note error:", error);
      toast({
        title: "Error adding note",
        description: error.response?.data?.message || error.message || "Failed to add note",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout title="Interventions & Notes" role="ADVISOR">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title="Interventions & Notes" role="ADVISOR">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No data available. Make sure your backend is running at http://localhost:8081</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Interventions & Notes" role="ADVISOR">
      <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-muted-foreground">
              {data.student.name.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">{data.student.name}</h2>
            <p className="text-muted-foreground mb-4">
              {data.student.major} - {data.student.year}
            </p>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Risk Tier</p>
                <RiskBadge tier={data.student.riskTier} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Term GPA</p>
                <p className="text-xl font-bold text-foreground">{data.student.termGpa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Attendance %</p>
                <p className="text-xl font-bold text-foreground">{data.student.attendance}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">LMS Engagement</p>
                <p className="text-xl font-bold text-foreground">{data.student.engagement}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="performance" className="mb-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance & LMS</TabsTrigger>
          <TabsTrigger value="financial">Financial & Support</TabsTrigger>
          <TabsTrigger value="notes">Advisor Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
            <p className="text-muted-foreground">
              {data.student.name} shows strong aptitude but is struggling with core algorithm courses
              (CS 230, CS 250). Attendance has dropped in the last 3 weeks, correlating with low quiz
              scores. Engagement with LMS materials for these courses is also below average.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Past Notes</h3>
              <div className="space-y-4">
                {data.notes.map((note, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{note.date}</span>
                      <span className="text-xs text-muted-foreground">• {note.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Add New Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Note Type</label>
                  <Select value={noteType} onValueChange={setNoteType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advising_meeting">Advising Meeting</SelectItem>
                      <SelectItem value="tutoring">Tutoring Referral</SelectItem>
                      <SelectItem value="academic_warning">Academic Warning</SelectItem>
                      <SelectItem value="check_in">Check-in</SelectItem>
                      <SelectItem value="referral">Referral to Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddNote} className="w-full">
                  Add Note
                </Button>

                <p className="text-xs text-muted-foreground">
                  Note: The system will automatically generate a contextual note description based on
                  the student's current academic status.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdvisorNotes;
