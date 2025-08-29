import React from "react";
import ApperIcon from "@/components/ApperIcon";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import PriorityFilter from "@/components/molecules/PriorityFilter";
import TaskStats from "@/components/molecules/TaskStats";

const Sidebar = ({ 
  stats,
  selectedCategories,
  selectedPriorities,
  onCategoryToggle,
  onPriorityToggle,
  className 
}) => {
  return (
<aside className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="overflow-hidden">
          <TaskStats stats={stats} />
        </div>

        {/* Filters Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
            <ApperIcon name="Filter" size={20} className="text-primary-600" />
            <span>Filters</span>
          </div>

          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryToggle={onCategoryToggle}
          />

          <div className="border-t pt-6">
            <PriorityFilter
              selectedPriorities={selectedPriorities}
              onPriorityToggle={onPriorityToggle}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="flex items-center space-x-2 w-full p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
              <ApperIcon name="Archive" size={16} />
              <span>Archive Completed</span>
            </button>
            <button className="flex items-center space-x-2 w-full p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
              <ApperIcon name="Download" size={16} />
              <span>Export Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;