import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, className, valueColor }) => {
  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-sm", className)}>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className={cn("text-3xl font-bold", valueColor || "text-foreground")}>{value}</p>
    </div>
  );
};

export default StatCard;
