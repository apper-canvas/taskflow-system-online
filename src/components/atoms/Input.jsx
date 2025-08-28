import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  label,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label-field">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "input-field",
          error && "border-error-500 focus:ring-error-500/20 focus:border-error-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;