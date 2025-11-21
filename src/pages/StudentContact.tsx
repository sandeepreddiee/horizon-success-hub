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
          {/* Academic Advising */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Academic Advising Center</h2>
                <p className="text-sm text-muted-foreground mb-4">General Academic Support & Guidance</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>advising@horizonu.edu</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>(555) 100-2000</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Walk-in Hours: Mon-Fri 9 AM-5 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Location: Student Services Building, 2nd Floor</span>
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

          {/* Help Resources */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Additional Support Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">Tutoring Center</h4>
                <p className="text-sm text-muted-foreground mb-2">Free tutoring services for all courses</p>
                <p className="text-xs text-primary">tutoring@horizonu.edu</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">Career Services</h4>
                <p className="text-sm text-muted-foreground mb-2">Resume help, job search, internships</p>
                <p className="text-xs text-primary">careers@horizonu.edu</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">Counseling Services</h4>
                <p className="text-sm text-muted-foreground mb-2">Mental health and wellness support</p>
                <p className="text-xs text-primary">counseling@horizonu.edu</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">Financial Aid Office</h4>
                <p className="text-sm text-muted-foreground mb-2">Scholarships, loans, and aid questions</p>
                <p className="text-xs text-primary">finaid@horizonu.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentContact;
