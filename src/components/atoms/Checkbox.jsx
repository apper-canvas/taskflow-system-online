import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className,
  label,
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div className={cn(
          "w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center",
          checked 
            ? "bg-gradient-to-br from-primary-500 to-primary-600 border-primary-500 shadow-md" 
            : "border-gray-300 bg-white group-hover:border-primary-400 group-hover:shadow-sm",
          className
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              size={12} 
              className="text-white animate-scale-in" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;