import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className,
  error,
  label,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label-field">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "input-field resize-none",
          error && "border-error-500 focus:ring-error-500/20 focus:border-error-500",
          className
        )}
        rows={rows}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;