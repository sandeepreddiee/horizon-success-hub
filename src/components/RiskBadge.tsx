import React from "react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  tier: "High" | "Medium" | "Low";
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ tier, className }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium inline-block",
        tier === "High" && "bg-risk-high text-risk-high-text",
        tier === "Medium" && "bg-risk-medium text-risk-medium-text",
        tier === "Low" && "bg-risk-low text-risk-low-text",
        className
      )}
    >
      {tier}
    </span>
  );
};

export default RiskBadge;
