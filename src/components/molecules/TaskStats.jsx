import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskStats = ({ stats, className }) => {
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total || 0,
      icon: "CheckSquare",
      color: "primary",
      bgGradient: "from-primary-500 to-primary-600"
    },
    {
      label: "Completed",
      value: stats.completed || 0,
      icon: "CheckCircle",
      color: "success",
      bgGradient: "from-success-500 to-success-600"
    },
    {
      label: "In Progress",
      value: stats.pending || 0,
      icon: "Clock",
      color: "warning",
      bgGradient: "from-warning-500 to-warning-600"
    },
    {
      label: "High Priority",
      value: stats.highPriority || 0,
      icon: "AlertTriangle",
      color: "error",
      bgGradient: "from-error-500 to-error-600"
    }
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-card p-4 shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-br",
                stat.bgGradient,
                "flex items-center justify-center shadow-lg"
              )}>
                <ApperIcon 
                  name={stat.icon} 
                  size={20} 
                  className="text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Progress
          </h3>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {completionRate}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>
    </div>
  );
};

export default TaskStats;