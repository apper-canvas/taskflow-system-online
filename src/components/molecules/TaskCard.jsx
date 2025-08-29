import React, { useState } from "react";
import { format, isPast, isToday, parseISO } from "date-fns";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import TaskStats from "@/components/molecules/TaskStats";
import PriorityDot from "@/components/atoms/PriorityDot";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const { categories } = useCategories();

  const category = categories.find(cat => cat.name === task.category);
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && !task.completed;
  const isDueToday = isToday(dueDate);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.Id);
      
      // Add completion animation
      if (!task.completed) {
        setTimeout(() => {
          setIsCompleting(false);
        }, 400);
      }
    } catch (error) {
      setIsCompleting(false);
    }
  };

  const formatDueDate = (date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "MMM d");
  };

  return (
    <div className={cn(
      "card p-4 transition-all duration-300",
      task.completed && "opacity-75",
      isCompleting && task.completed && "task-completed",
      isOverdue && "border-l-4 border-error-500"
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className="w-5 h-5"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "text-base font-semibold text-gray-900 mb-1",
                task.completed && "strike-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-3",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <PriorityDot priority={task.priority} size="sm" />
                  <span className="text-xs font-medium text-gray-500 capitalize">
                    {task.priority}
                  </span>
                </div>

                {category && (
                  <Badge 
                    color={category.color}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <ApperIcon name={category.icon} size={12} />
                    <span>{category.name}</span>
                  </Badge>
)}

                <div className={cn(
                  "flex items-center space-x-1 text-xs",
                  isOverdue && "text-error-600 font-medium",
                  isDueToday && "text-warning-600 font-medium",
                  !isOverdue && !isDueToday && "text-gray-500"
                )}>
                  <ApperIcon 
                    name="Calendar"
                    className={cn(
                      isOverdue && "text-error-500",
                      isDueToday && "text-warning-500"
                    )}
                  />
                  <span>{formatDueDate(dueDate)}</span>
                  {task.isRecurring && (
                    <div className="flex items-center ml-2">
                      <ApperIcon 
                        name="RotateCcw" 
                        size={10} 
                        className="text-primary-500"
                      />
                    </div>
                  )}
                  {isOverdue && (
                    <Badge variant="error" size="sm" className="ml-2">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-primary-600"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.Id)}
                className="text-gray-400 hover:text-error-600"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;