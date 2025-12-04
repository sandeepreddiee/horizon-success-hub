import { Badge } from "@/components/ui/badge";
import { GraduationCap, UserCog } from "lucide-react";

interface RoleBadgeProps {
  role: "STUDENT" | "ADVISOR";
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  if (role === "STUDENT") {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 backdrop-blur-sm">
        <div className="p-1 rounded-md bg-secondary/20">
          <GraduationCap className="w-4 h-4 text-secondary" />
        </div>
        <span className="text-sm font-semibold text-secondary">Student</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
      <div className="p-1 rounded-md bg-white/20">
        <UserCog className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-semibold text-white">Advisor</span>
    </div>
  );
};

export default RoleBadge;
