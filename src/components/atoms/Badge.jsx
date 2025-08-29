import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  color,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    accent: "bg-accent-100 text-accent-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    outline: "border border-gray-300 text-gray-700 bg-transparent"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

const customStyle = color ? {
    backgroundColor: `${color}15`,
    color: color,
    border: `1px solid ${color}30`,
    fontWeight: '500'
  } : {};

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        !color && variants[variant],
        sizes[size],
        className
      )}
      style={color ? customStyle : {}}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;