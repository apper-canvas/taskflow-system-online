import React from "react";
import Chart from "react-apexcharts";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TaskStats = ({ stats, className }) => {
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total || 0,
      icon: "ListTodo",
      bgGradient: "from-blue-500 to-blue-600",
      change: stats.totalChange || 0
    },
    {
      label: "Completed",
      value: stats.completed || 0,
      icon: "CheckCircle2",
      bgGradient: "from-success-500 to-success-600",
      change: stats.completedChange || 0
    },
    {
      label: "In Progress",
      value: stats.pending || 0,
      icon: "Clock",
      bgGradient: "from-warning-500 to-warning-600",
      change: stats.pendingChange || 0
    },
    {
      label: "High Priority",
      value: stats.highPriority || 0,
      icon: "AlertTriangle",
      bgGradient: "from-error-500 to-error-600",
      change: stats.highPriorityChange || 0
    }
  ];

  // Productivity chart data
  const productivityData = stats.weeklyCompletion || [0, 0, 0, 0, 0, 0, 0];
  const areaChartOptions = {
    chart: {
      type: 'area',
      height: 200,
      sparkline: {
        enabled: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
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
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    colors: ['#5B4FE9'],
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    }
  };

  // Completion donut chart
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const donutOptions = {
    chart: {
      type: 'donut',
      height: 120
    },
    colors: ['#5B4FE9', '#e5e7eb'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  };

  const donutSeries = [stats.completed || 0, (stats.total - stats.completed) || 0];

  // Task velocity (tasks completed per day)
  const taskVelocity = stats.velocity || 0;
const avgCompletionTime = stats.avgCompletionTime || 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Statistics Cards */
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-card p-4 shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-1">
                    <ApperIcon 
                      name={stat.change > 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={stat.change > 0 ? "text-success-500" : "text-error-500"}
                    />
                    <span className={cn(
                      "text-xs font-medium ml-1",
                      stat.change > 0 ? "text-success-600" : "text-error-600"
                    )}>
                      {Math.abs(stat.change)}
                    </span>
                  </div>
)}
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
      {/* Charts Row */
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Completion Overview */}
        <div className="bg-white rounded-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Completion Overview
            </h3>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {completionRate}%
            </span>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Chart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                height={120}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>

        {/* Productivity Trends */}
        <div className="bg-white rounded-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Progress
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="TrendingUp" size={16} className="mr-1" />
              <span>7 Days</span>
            </div>
          </div>
          
          <div className="mb-4">
            <Chart
              options={areaChartOptions}
              series={[{
                name: 'Tasks Completed',
                data: productivityData
              }]}
              type="area"
              height={120}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{taskVelocity}</div>
              <div className="text-xs text-gray-500">Tasks/Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgCompletionTime}h</div>
              <div className="text-xs text-gray-500">Avg Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Progress Bar */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Detailed Progress
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Remaining</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Overall</span>
              <span className="text-sm text-gray-500">{stats.completed}/{stats.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          {/* High Priority Progress */}
          {stats.highPriority > 0 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">High Priority</span>
<span className="text-sm text-gray-500">{stats.highPriorityCompleted || 0}/{stats.highPriority}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-error-500 to-error-600 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${stats.highPriority > 0 ? Math.round(((stats.highPriorityCompleted || 0) / stats.highPriority) * 100) : 0}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Productivity Score</span>
            <span className="font-semibold text-primary-600">{Math.min(Math.round(completionRate * 1.2), 100)}%</span>
          </div>
        </div>
</div>
    </div>
  );
};

export default TaskStats;