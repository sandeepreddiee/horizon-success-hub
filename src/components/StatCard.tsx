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
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = React.memo(({ 
  title, 
  label, 
  value, 
  className, 
  valueColor, 
  icon: Icon, 
  trend,
  subtitle 
}) => {
  const displayLabel = title || label;
  
  const getTrendColor = () => {
    if (trend === "danger") return "text-destructive";
    if (trend === "success") return "text-success";
    return "text-foreground";
  };

  return (
    <div className={cn(
      "stat-card p-6 transition-all duration-300 hover:shadow-premium-lg group",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{displayLabel}</p>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className={cn(
        "text-3xl font-heading font-bold tracking-tight", 
        valueColor || getTrendColor()
      )}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
});

StatCard.displayName = "StatCard";

export default StatCard;
