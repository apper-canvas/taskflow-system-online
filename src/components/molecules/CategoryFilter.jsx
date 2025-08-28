import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { useCategories } from "@/hooks/useCategories";

const CategoryFilter = ({ selectedCategories = [], onCategoryToggle }) => {
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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Categories
      </h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name);
          
          return (
            <button
              key={category.Id}
              onClick={() => onCategoryToggle(category.name)}
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? "bg-primary-50 border-2 border-primary-200" : ""
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
              <span className={`text-sm font-medium flex-1 text-left ${
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