import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, AlertTriangle, FileText, BarChart3, BookOpen } from "lucide-react";
import logoImage from "@/assets/horizon-logo.png";
import RoleBadge from "@/components/RoleBadge";

const AdvisorSidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/advisor/dashboard" },
    { icon: Users, label: "My Students", path: "/advisor/students" },
    { icon: AlertTriangle, label: "Risk Alerts", path: "/advisor/alerts" },
    { icon: FileText, label: "Interventions", path: "/advisor/interventions" },
    { icon: BarChart3, label: "Reports", path: "/advisor/reports" },
    { icon: BookOpen, label: "Resources", path: "/advisor/resources" },
  ];

  return (
    <aside className="w-72 sidebar-premium min-h-screen p-6 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-11 h-11 rounded-xl bg-white/10 p-1.5 backdrop-blur-sm">
          <img src={logoImage} alt="Horizon University" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="text-sm font-heading font-bold text-white tracking-tight">Horizon</div>
          <div className="text-xs text-white/60">University Portal</div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-8 px-2">
        <RoleBadge role="ADVISOR" />
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          let isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          
          if (item.path === "/advisor/students" && location.pathname.startsWith("/advisor/student/")) {
            isActive = true;
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-foreground shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? "bg-primary/10" : "bg-transparent group-hover:bg-white/5"
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 mt-auto">
        <div className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <p className="text-xs text-white/50 mb-1">Academic Year</p>
          <p className="text-sm font-medium text-white/90">Fall 2024</p>
        </div>
      </div>
    </aside>
  );
};

export default AdvisorSidebar;
