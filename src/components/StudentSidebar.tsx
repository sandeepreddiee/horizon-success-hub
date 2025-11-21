import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, TrendingUp, Library, Headphones } from "lucide-react";
import logoImage from "@/assets/horizon-logo.png";

const StudentSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
    { icon: BookOpen, label: "My Courses", path: "/student/courses" },
    { icon: TrendingUp, label: "My Progress", path: "/student/progress" },
    { icon: Library, label: "Resources & Support", path: "/student/resources" },
    { icon: Headphones, label: "Help & Contact Advisor", path: "/student/contact" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
      <div className="flex items-center gap-3 mb-8">
        <img src={logoImage} alt="Horizon University" className="w-10 h-10" />
        <div className="text-sm text-muted-foreground">Horizon University</div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default StudentSidebar;
