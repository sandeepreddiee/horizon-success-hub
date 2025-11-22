import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  className?: string;
  valueColor?: string;
  icon?: LucideIcon;
  trend?: "danger" | "success" | "neutral";
}

const StatCard: React.FC<StatCardProps> = React.memo(({ title, label, value, className, valueColor, icon: Icon, trend }) => {
  const displayLabel = title || label;
  
  const getTrendColor = () => {
    if (trend === "danger") return "text-destructive";
    if (trend === "success") return "text-green-600";
    return "text-foreground";
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{displayLabel}</p>
        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      </div>
      <p className={cn("text-3xl font-heading font-semibold", valueColor || getTrendColor())}>{value}</p>
    </div>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;
