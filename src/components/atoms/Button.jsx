import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500 hover:scale-[1.02]",
    secondary: "bg-white border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 shadow-sm hover:shadow-md focus:ring-primary-500 hover:scale-[1.02]",
    accent: "bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white shadow-md hover:shadow-lg focus:ring-accent-500 hover:scale-[1.02]",
    ghost: "text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:scale-[1.02]",
    danger: "bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-md hover:shadow-lg focus:ring-error-500 hover:scale-[1.02]",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white focus:ring-primary-500 hover:scale-[1.02]"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    default: "px-6 py-3 text-base rounded-button",
    lg: "px-8 py-4 text-lg rounded-button",
    icon: "p-2 rounded-md"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;