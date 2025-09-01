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
<div className={cn("space-y-6", className)}>
      {/* Statistics Cards */}
<div className="grid grid-cols-1 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-card p-5 shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 mb-2 truncate">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <div className="flex items-center gap-1">
                    <ApperIcon 
                      name={stat.change > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={stat.change > 0 ? "text-success-500" : "text-error-500"}
                    />
                    <span className={cn(
                      "text-xs font-medium",
                      stat.change > 0 ? "text-success-500" : "text-error-500"
                    )}>
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                )}
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg bg-gradient-to-br flex-shrink-0",
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

      {/* Main Dashboard Grid */}
<div className="space-y-6">
        {/* Completion Overview */}
<div className="bg-gray-50 rounded-card p-4">
          <div className="text-center">
<h3 className="text-base font-semibold text-gray-900 mb-4">
              Completion Overview
            </h3>
            
<div className="relative w-32 h-32 mx-auto mb-4">
              <Chart
                options={circularOptions}
                series={circularSeries}
                type="donut"
                height={192}
                width={192}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
{completionRate}%
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Complete
                  </div>
                </div>
              </div>
            </div>
            
<div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-600 font-medium">
                {stats.completed || 0} of {stats.total || 0} tasks completed
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
<div className="bg-gray-50 rounded-card p-4">
          <div className="text-center">
<div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Weekly Progress
              </h3>
              <ApperIcon name="TrendingUp" size={20} className="text-primary-500" />
            </div>
            
<div className="mb-4">
              <Chart
                options={areaOptions}
                series={areaSeries}
                type="area"
                height={120}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {taskVelocity}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Tasks/Day
                </div>
</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {avgCompletionTime}h
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Average Time
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Detailed Progress */}
<div className="bg-gray-50 rounded-card p-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Today's Detailed Progress
            </h3>
            
<div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Remaining</span>
              </div>
            </div>
            
<div className="space-y-3">
              {/* Overall Progress */}
<div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Overall Tasks</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats.completed || 0}/{stats.total || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* High Priority Progress */}
              {stats.highPriority > 0 && (
                <div>
<div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">High Priority</span>
                    <span className="text-sm font-bold text-error-600">
                      {stats.highPriorityCompleted || 0}/{stats.highPriority}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-error-500 to-error-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${stats.highPriority > 0 ? Math.round(((stats.highPriorityCompleted || 0) / stats.highPriority) * 100) : 0}%` 
                      }}
                    />
                  </div>
                </div>
              )}

<div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Productivity Score</span>
                  <span className="text-lg font-bold text-primary-600">
                    {Math.min(Math.round(completionRate * 1.2), 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;