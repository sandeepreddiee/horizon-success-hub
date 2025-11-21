import { Badge } from "@/components/ui/badge";
import { GraduationCap, UserCog } from "lucide-react";

interface RoleBadgeProps {
  role: "STUDENT" | "ADVISOR";
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  if (role === "STUDENT") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
        <GraduationCap className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Student</span>
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5">
      <UserCog className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">Advisor</span>
    </Badge>
  );
};

export default RoleBadge;
