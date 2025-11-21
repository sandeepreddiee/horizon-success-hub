import React from "react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  tier?: "High" | "Medium" | "Low";
  level?: "High" | "Medium" | "Low";
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ tier, level, className }) => {
  const riskLevel = tier || level || "Low";
  
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium inline-block",
        riskLevel === "High" && "bg-risk-high text-risk-high-text",
        riskLevel === "Medium" && "bg-risk-medium text-risk-medium-text",
        riskLevel === "Low" && "bg-risk-low text-risk-low-text",
        className
      )}
    >
      {riskLevel}
    </span>
  );
};

export default RiskBadge;
