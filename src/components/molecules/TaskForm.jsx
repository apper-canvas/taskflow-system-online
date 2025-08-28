import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import ApperIcon from "@/components/ApperIcon";
import { useCategories } from "@/hooks/useCategories";
const TaskForm = ({ task, onSubmit, onCancel }) => {
  const { categories } = useCategories();
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    isRecurring: false,
    recurrencePattern: "daily",
    recurrenceInterval: 1,
    recurrenceEndType: "never",
    recurrenceEndDate: format(new Date(), "yyyy-MM-dd")
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        category: task.category || "work",
        dueDate: task.dueDate || format(new Date(), "yyyy-MM-dd"),
        isRecurring: task.isRecurring || false,
        recurrencePattern: task.recurrencePattern || "daily",
        recurrenceInterval: task.recurrenceInterval || 1,
        recurrenceEndType: task.recurrenceEndType || "never",
        recurrenceEndDate: task.recurrenceEndDate || format(new Date(), "yyyy-MM-dd")
      });
    }
  }, [task]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Task Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title..."
          error={errors.title}
          required
        />
      </div>

      <div>
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add task description (optional)..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>

        <div>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
            required
          />
        </div>
</div>

      {/* Recurrence Section */}
      <div className="bg-gray-50 p-4 rounded-input space-y-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" size={16} className="text-primary-500" />
          <label className="text-sm font-medium text-gray-700">
            Recurring Task
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.isRecurring}
            onChange={(checked) => handleChange("isRecurring", checked)}
            id="recurring"
          />
          <label htmlFor="recurring" className="text-sm text-gray-600">
            Make this task recurring
          </label>
        </div>

        {formData.isRecurring && (
          <div className="space-y-4 pl-6 border-l-2 border-primary-200">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Repeat every"
                value={formData.recurrencePattern}
                onChange={(value) => handleChange("recurrencePattern", value)}
                error={errors.recurrencePattern}
              >
                <option value="daily">Day(s)</option>
                <option value="weekly">Week(s)</option>
                <option value="monthly">Month(s)</option>
              </Select>
              
              <Input
                type="number"
                label="Interval"
                min="1"
                max="30"
                value={formData.recurrenceInterval}
                onChange={(e) => handleChange("recurrenceInterval", parseInt(e.target.value) || 1)}
                error={errors.recurrenceInterval}
                placeholder="1"
              />
            </div>

            <Select
              label="End recurrence"
              value={formData.recurrenceEndType}
              onChange={(value) => handleChange("recurrenceEndType", value)}
            >
              <option value="never">Never</option>
              <option value="on">On specific date</option>
              <option value="after">After number of occurrences</option>
            </Select>

            {formData.recurrenceEndType === "on" && (
              <Input
                type="date"
                label="End date"
                value={formData.recurrenceEndDate}
                onChange={(e) => handleChange("recurrenceEndDate", e.target.value)}
                min={formData.dueDate}
              />
            )}

            {formData.recurrenceEndType === "after" && (
              <Input
                type="number"
                label="Number of occurrences"
                min="1"
                max="100"
                value={formData.recurrenceEndAfter || 10}
                onChange={(e) => handleChange("recurrenceEndAfter", parseInt(e.target.value) || 10)}
                placeholder="10"
              />
            )}

            <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-input">
              <ApperIcon name="Info" size={14} className="text-blue-500 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Recurring Task Preview:</p>
                <p>
                  This task will repeat every {formData.recurrenceInterval} {formData.recurrencePattern.slice(0, -1)}
                  {formData.recurrenceInterval > 1 ? 's' : ''}
                  {formData.recurrenceEndType === "on" && formData.recurrenceEndDate && 
                    ` until ${format(new Date(formData.recurrenceEndDate), "MMM dd, yyyy")}`}
                  {formData.recurrenceEndType === "after" && 
                    ` for ${formData.recurrenceEndAfter || 10} occurrences`}
                  {formData.recurrenceEndType === "never" && " indefinitely"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;