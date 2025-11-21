import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, AlertTriangle, FileText, BarChart3, BookOpen } from "lucide-react";
import logoImage from "@/assets/horizon-logo.png";

const AdvisorSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/advisor/dashboard" },
    { icon: Users, label: "My Students", path: "/advisor/students" },
    { icon: AlertTriangle, label: "Risk Alerts", path: "/advisor/alerts" },
    { icon: FileText, label: "Interventions & Notes", path: "/advisor/interventions" },
    { icon: BarChart3, label: "Reports & Insights", path: "/advisor/reports" },
    { icon: BookOpen, label: "Resources & Support", path: "/advisor/resources" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
      <div className="flex items-center gap-3 mb-8">
        <img src={logoImage} alt="Horizon University" className="w-10 h-10" />
        <div className="text-sm font-heading font-semibold text-foreground">Horizon University</div>
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
                  ? "bg-primary text-primary-foreground"
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

export default AdvisorSidebar;
