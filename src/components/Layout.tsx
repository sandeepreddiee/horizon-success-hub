import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutGrid, Users, AlertTriangle, FileText, BarChart3, BookOpen, TrendingUp, HelpCircle, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/horizon-logo.png";

interface LayoutProps {
  children: ReactNode;
  title: string;
  role: "ADVISOR" | "STUDENT";
}

const Layout = ({ children, title, role }: LayoutProps) => {
  const { logout } = useAuth();
  const location = useLocation();

  const advisorLinks = [
    { to: "/advisor/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { to: "/advisor/students", icon: Users, label: "My Students" },
    { to: "/advisor/alerts", icon: AlertTriangle, label: "Risk Alerts" },
    { to: "/advisor/notes", icon: FileText, label: "Interventions & Notes" },
    { to: "/advisor/reports", icon: BarChart3, label: "Reports & Insights" },
    { to: "/advisor/resources", icon: BookOpen, label: "Resources & Support" },
  ];

  const studentLinks = [
    { to: "/student/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { to: "/student/courses", icon: BookOpen, label: "My Courses" },
    { to: "/student/progress", icon: TrendingUp, label: "My Progress" },
    { to: "/student/resources", icon: BookOpen, label: "Resources & Support" },
    { to: "/student/help", icon: HelpCircle, label: "Help & Contact Advisor" },
  ];

  const links = role === "ADVISOR" ? advisorLinks : studentLinks;
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="flex min-h-screen bg-background w-full">
      <aside className="w-64 bg-card border-r border-border flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Horizon University" className="w-10 h-10" />
            <span className="text-sm font-medium text-muted-foreground">Horizon University</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive(link.to)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sidebar-foreground rounded-lg transition-colors hover:bg-sidebar-accent"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
