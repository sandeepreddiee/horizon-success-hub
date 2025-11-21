import StudentSidebar from "@/components/StudentSidebar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Users, BookOpen, GraduationCap, Heart, DollarSign, Briefcase, ExternalLink } from "lucide-react";

const resources = [
  {
    category: "Academic Support",
    icon: BookOpen,
    items: [
      { title: "Tutoring Center", description: "Free tutoring in math, science, and writing", link: "#" },
      { title: "Writing Center", description: "Help with essays and research papers", link: "#" },
      { title: "Library Services", description: "Research assistance and study spaces", link: "#" },
      { title: "Study Groups", description: "Join or create study groups", link: "#" },
    ]
  },
  {
    category: "Student Wellness",
    icon: Heart,
    items: [
      { title: "Counseling Services", description: "Mental health support and crisis resources", link: "#" },
      { title: "Health Center", description: "Medical services and health education", link: "#" },
      { title: "Fitness Center", description: "Gym facilities and fitness classes", link: "#" },
      { title: "Wellness Workshops", description: "Stress management and mindfulness", link: "#" },
    ]
  },
  {
    category: "Financial Aid",
    icon: DollarSign,
    items: [
      { title: "Scholarships", description: "Search and apply for scholarships", link: "#" },
      { title: "Financial Aid Office", description: "FAFSA help and financial planning", link: "#" },
      { title: "Emergency Funds", description: "Short-term financial assistance", link: "#" },
      { title: "Work-Study Programs", description: "On-campus employment opportunities", link: "#" },
    ]
  },
  {
    category: "Career Services",
    icon: Briefcase,
    items: [
      { title: "Career Counseling", description: "One-on-one career guidance", link: "#" },
      { title: "Resume Builder", description: "Create and review your resume", link: "#" },
      { title: "Job Board", description: "Browse internships and jobs", link: "#" },
      { title: "Interview Prep", description: "Mock interviews and tips", link: "#" },
    ]
  },
];

const StudentResources = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      
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
          <div className="mb-8 bg-primary/10 rounded-lg border border-primary/20 p-6">
            <div className="flex items-start gap-4">
              <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Success is Our Priority</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the resources below to support your academic journey and overall well-being. Don't hesitate to reach out – we're here to help you succeed!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {resources.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.category}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">{section.category}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#" className="text-sm text-primary hover:underline">Student Handbook</a>
              <a href="#" className="text-sm text-primary hover:underline">Academic Calendar</a>
              <a href="#" className="text-sm text-primary hover:underline">Campus Map</a>
              <a href="#" className="text-sm text-primary hover:underline">IT Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
