import React from "react";
import { useCategories } from "@/hooks/useCategories";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const CategoryFilter = ({ selectedCategories = [], onCategoryToggle, onAddCategory }) => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
<div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Categories
        </h3>
<button
          onClick={onAddCategory}
          disabled={!onAddCategory}
          className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add Category"
        >
          <ApperIcon name="Plus" size={14} className="text-gray-500 hover:text-primary-600" />
        </button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);
          
          return (
            <button
              key={category.Id}
onClick={() => onCategoryToggle(category.name)}
              className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? "bg-primary-50 border border-primary-200" : "border border-transparent"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: category.color }}
              />
              <ApperIcon 
                name={category.icon} 
                size={14} 
                className="text-gray-500"
              />
<span className={`text-xs font-medium flex-1 text-left min-w-0 truncate ${
                isSelected ? "text-primary-700" : "text-gray-700"
              }`}>
                {category.name}
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

export default CategoryFilter;