import AdvisorSidebar from "@/components/AdvisorSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, BookOpen, ExternalLink, FileText, Video, HelpCircle } from "lucide-react";

const resources = [
  {
    category: "Academic Support",
    items: [
      { title: "Tutoring Center Schedule", icon: BookOpen, link: "#", description: "View available tutoring hours and subjects" },
      { title: "Writing Center Services", icon: FileText, link: "#", description: "Help with essays, papers, and academic writing" },
      { title: "Math Lab Resources", icon: BookOpen, link: "#", description: "Drop-in math tutoring and study materials" },
    ]
  },
  {
    category: "Student Wellness",
    items: [
      { title: "Counseling Services", icon: HelpCircle, link: "#", description: "Mental health support and crisis resources" },
      { title: "Financial Aid Office", icon: FileText, link: "#", description: "Scholarships, grants, and financial planning" },
      { title: "Career Services", icon: BookOpen, link: "#", description: "Resume help, job search, and career counseling" },
    ]
  },
  {
    category: "Training Materials",
    items: [
      { title: "Advisor Training Videos", icon: Video, link: "#", description: "Best practices for student interventions" },
      { title: "Early Alert System Guide", icon: FileText, link: "#", description: "How to identify and respond to at-risk students" },
      { title: "Communication Templates", icon: FileText, link: "#", description: "Email templates for common student situations" },
    ]
  },
];

const AdvisorResources = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AdvisorSidebar />
      
      <div className="flex-1">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Resources & Support</h1>
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
          <div className="space-y-8">
            {resources.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-semibold text-foreground mb-4">{section.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.link}
                        className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-primary/10 rounded-lg border border-primary/20 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Need Additional Support?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contact the Academic Success Center for personalized assistance with student interventions and academic planning.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Contact Academic Success Center
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorResources;
