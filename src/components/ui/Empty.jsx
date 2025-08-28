import React from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = () => {
  const location = useLocation();
  
  const getEmptyContent = () => {
    switch (location.pathname) {
      case "/today":
        return {
          icon: "Calendar",
          title: "No tasks for today!",
          description: "Looks like you're all caught up for today. Take a moment to plan ahead or enjoy some well-deserved downtime.",
          action: "Plan Tomorrow"
        };
      case "/upcoming":
        return {
          icon: "Clock",
          title: "No upcoming tasks",
          description: "Your schedule is clear for the next week. This is a great time to plan new projects or focus on long-term goals.",
          action: "Add New Task"
        };
      case "/completed":
        return {
          icon: "CheckCircle",
          title: "No completed tasks yet",
          description: "Start completing tasks to see them here. Every completed task is a step towards your goals!",
          action: "View All Tasks"
        };
      default:
        return {
          icon: "CheckSquare",
          title: "No tasks yet!",
          description: "Get started by creating your first task. Break down your goals into actionable items and boost your productivity.",
          action: "Create Your First Task"
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-card p-8 shadow-card max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon 
            name={content.icon} 
            size={36} 
            className="text-white"
          />
        </div>
        
        <h3 className="text-xl font-semibold font-display text-gray-900 mb-3">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={18} />
            <span>{content.action}</span>
          </Button>
          
          <Button variant="secondary" className="flex items-center space-x-2">
            <ApperIcon name="Lightbulb" size={18} />
            <span>Get Tips</span>
          </Button>
        </div>
        
        {/* Motivational Quote */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <blockquote className="text-sm text-gray-500 italic">
            "The secret of getting ahead is getting started."
          </blockquote>
          <cite className="text-xs text-gray-400 mt-1 block">- Mark Twain</cite>
        </div>
      </div>
    </div>
  );
};

export default Empty;