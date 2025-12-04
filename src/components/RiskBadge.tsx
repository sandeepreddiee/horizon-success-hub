import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RiskBadgeProps {
  tier?: "High" | "Medium" | "Low";
  level?: "High" | "Medium" | "Low";
  className?: string;
  showIcon?: boolean;
}

const RiskBadge: React.FC<RiskBadgeProps> = React.memo(({ tier, level, className, showIcon = true }) => {
  const riskLevel = tier || level || "Low";
  
  const getIcon = () => {
    if (!showIcon) return null;
    const iconClass = "w-3.5 h-3.5";
    switch (riskLevel) {
      case "High": return <AlertTriangle className={iconClass} />;
      case "Medium": return <AlertCircle className={iconClass} />;
      case "Low": return <CheckCircle className={iconClass} />;
    }
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200",
        riskLevel === "High" && "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-sm",
        riskLevel === "Medium" && "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-sm",
        riskLevel === "Low" && "bg-gradient-to-r from-success to-success/90 text-success-foreground shadow-sm",
        className
      )}
    >
      {getIcon()}
      {riskLevel}
    </span>
  );
});

RiskBadge.displayName = "RiskBadge";

export default RiskBadge;
