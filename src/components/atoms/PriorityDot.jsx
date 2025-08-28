import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const PriorityDot = forwardRef(({ 
  priority = "medium", 
  size = "default",
  className,
  animate = true,
  ...props 
}, ref) => {
  const baseClasses = "rounded-full transition-all duration-200";
  
  const priorities = {
    high: "bg-gradient-to-br from-error-400 to-error-500 shadow-error-500/30",
    medium: "bg-gradient-to-br from-warning-400 to-warning-500 shadow-warning-500/30",
    low: "bg-gradient-to-br from-success-400 to-success-500 shadow-success-500/30"
  };

  const sizes = {
    sm: "w-2 h-2",
    default: "w-3 h-3 shadow-sm",
    lg: "w-4 h-4 shadow-md"
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        priorities[priority],
        sizes[size],
        animate && "priority-dot hover:scale-110",
        className
      )}
      title={`${priority} priority`}
      {...props}
    />
  );
});

PriorityDot.displayName = "PriorityDot";

export default PriorityDot;