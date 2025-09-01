import React from "react";
import PriorityDot from "@/components/atoms/PriorityDot";
import ApperIcon from "@/components/ApperIcon";

const PriorityFilter = ({ selectedPriorities = [], onPriorityToggle }) => {
  const priorities = [
    { value: "high", label: "High Priority", color: "error" },
    { value: "medium", label: "Medium Priority", color: "warning" },
    { value: "low", label: "Low Priority", color: "success" }
  ];

  return (
<div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
        Priority
      </h3>
      <div className="space-y-2">
        {priorities.map((priority) => {
          const isSelected = selectedPriorities.includes(priority.value);
          
          return (
            <button
              key={priority.value}
              onClick={() => onPriorityToggle(priority.value)}
className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? "bg-primary-50 border border-primary-200" : "border border-transparent"
              }`}
            >
              <PriorityDot priority={priority.value} size="default" />
<span className={`text-xs font-medium flex-1 text-left truncate ${
                isSelected ? "text-primary-700" : "text-gray-700"
              }`}>
                {priority.label}
              </span>
              {isSelected && (
                <ApperIcon 
                  name="Check" 
                  size={14} 
                  className="text-primary-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityFilter;