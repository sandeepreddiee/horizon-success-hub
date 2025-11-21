import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, Mail, Phone, Calendar, MessageSquare, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const StudentContact = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message sent",
      description: "Your advisor will respond within 24 hours.",
    });
    setMessage("");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Help & Contact Advisor</h1>
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
          {/* Advisor Info */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Dr. Sarah Smith</h2>
                <p className="text-sm text-muted-foreground mb-4">Academic Advisor • Computer Science Department</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>sarah.smith@horizonu.edu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Office Hours: Mon-Fri 2-4 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Office: Building A, Room 305</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Request Virtual Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Request Phone Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Meeting Notes
                </Button>
              </div>
            </div>

            {/* Send Message */}
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Send a Message</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()} className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your advisor typically responds within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Conversations</h3>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">Course Registration Guidance</h4>
                  <span className="text-xs text-muted-foreground">Nov 15, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground">Discussed spring semester course selection and prerequisites...</p>
              </div>
              <div className="border-b border-border pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">Academic Progress Review</h4>
                  <span className="text-xs text-muted-foreground">Oct 28, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground">Reviewed current GPA and discussed strategies for improvement...</p>
              </div>
              <div className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">Career Planning Discussion</h4>
                  <span className="text-xs text-muted-foreground">Oct 10, 2024</span>
                </div>
                <p className="text-sm text-muted-foreground">Explored internship opportunities and career paths...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentContact;
