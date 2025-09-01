import React from "react";
import Chart from "react-apexcharts";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TaskStats = ({ stats, className }) => {
  // Calculate completion rate
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  // Task velocity and completion time
  const taskVelocity = stats.velocity || 0;
  const avgCompletionTime = stats.avgCompletionTime || 0;

  // Weekly progress chart data
  const weeklyData = stats.weeklyCompletion || [0, 0, 0, 0, 0, 0, 0];

  // Statistics cards data
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total || 0,
      change: stats.totalChange || 0,
      icon: "CheckSquare",
      bgGradient: "from-blue-500 to-blue-600"
    },
    {
      label: "Completed",
      value: stats.completed || 0,
      change: stats.completedChange || 0,
      icon: "CheckCircle",
      bgGradient: "from-green-500 to-green-600"
    },
    {
      label: "In Progress",
      value: stats.inProgress || 0,
      change: stats.inProgressChange || 0,
      icon: "Clock",
      bgGradient: "from-yellow-500 to-yellow-600"
    },
    {
      label: "Pending",
      value: stats.pending || 0,
      change: stats.pendingChange || 0,
      icon: "AlertCircle",
      bgGradient: "from-red-500 to-red-600"
    }
  ];

  // Circular progress chart options
  const circularOptions = {
    chart: {
      type: 'donut',
      height: 200,
      sparkline: { enabled: true }
    },
    colors: ['#5B4FE9', '#E5E7EB'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: false
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 },
    tooltip: { enabled: false }
  };

  const circularSeries = [stats.completed || 0, Math.max((stats.total || 0) - (stats.completed || 0), 0)];

  // Weekly area chart options
  const areaOptions = {
    chart: {
      type: 'area',
      height: 120,
      sparkline: { enabled: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 600
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1
      }
    },
    colors: ['#5B4FE9'],
    tooltip: { enabled: false }
  };

  const areaSeries = [{
    name: 'Tasks Completed',
    data: weeklyData
  }];

  return (
<div className={cn("space-y-4", className)}>
      {/* Today's Detailed Progress */}
      <div className="bg-gray-50 rounded-card p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Progress
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Remaining</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-700">Today's Tasks</span>
                <span className="text-xs font-bold text-gray-900">
                  {stats.completed || 0}/{stats.total || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% Complete
              </div>
            </div>

            {/* High Priority Progress */}
            {(stats.highPriority > 0 || stats.highPriorityCompleted > 0) && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700">High Priority</span>
                  <span className="text-xs font-bold text-error-600">
                    {stats.highPriorityCompleted || 0}/{(stats.highPriority || 0) + (stats.highPriorityCompleted || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-error-500 to-error-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${((stats.highPriority || 0) + (stats.highPriorityCompleted || 0)) > 0 ? Math.round(((stats.highPriorityCompleted || 0) / ((stats.highPriority || 0) + (stats.highPriorityCompleted || 0))) * 100) : 0}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* Task Status Summary */}
            {stats.total > 0 && (
              <div className="pt-2 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-primary-600">{stats.completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium text-gray-700">{stats.pending || 0}</span>
                </div>
                {stats.pending === 0 && stats.total > 0 && (
                  <div className="text-center pt-2 text-success-600 font-medium text-xs">
                    🎉 All tasks completed!
                  </div>
                )}
              </div>
            )}

            {stats.total === 0 && (
              <div className="text-center py-3 text-gray-500">
                <ApperIcon name="Calendar" size={20} className="mx-auto mb-2 text-gray-400" />
                <p className="text-xs">No tasks for today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;