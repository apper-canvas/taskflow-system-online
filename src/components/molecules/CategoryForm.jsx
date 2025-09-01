import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#5B4FE9",
    icon: "Tag"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined color options
  const colorOptions = [
    "#5B4FE9", "#8B7FFF", "#4ECDC4", "#FFD93D", 
    "#FF6B6B", "#4D96FF", "#FF9500", "#34D399",
    "#F472B6", "#A78BFA", "#FB7185", "#60A5FA"
  ];

  // Popular icon options
  const iconOptions = [
    "Tag", "Briefcase", "User", "Home", "Heart", "ShoppingBag",
    "Car", "Plane", "Book", "Music", "Camera", "Coffee",
    "Gamepad2", "Dumbbell", "Utensils", "Stethoscope", "Graduation Cap", "Palette"
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        color: category.color || "#5B4FE9",
        icon: category.icon || "Tag"
      });
    }
  }, [category]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
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
      await onSubmit({
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon
      });
      toast.success(`Category ${category ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(error.message || `Failed to ${category ? 'update' : 'create'} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter category name..."
          error={errors.name}
          required
        />
      </div>

      <div>
        <label className="label-field">Color</label>
        <div className="grid grid-cols-6 gap-2 mt-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleChange("color", color)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                formData.color === color 
                  ? "border-gray-400 ring-2 ring-offset-2 ring-primary-500" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            >
              {formData.color === color && (
                <ApperIcon name="Check" size={14} className="text-white mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">Icon</label>
        <div className="grid grid-cols-6 gap-2 mt-2 max-h-48 overflow-y-auto">
          {iconOptions.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => handleChange("icon", iconName)}
              className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                formData.icon === iconName
                  ? "border-primary-500 bg-primary-50 text-primary-600"
                  : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name={iconName} size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-input">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: formData.color }}
        />
        <ApperIcon name={formData.icon} size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {formData.name || "Category Preview"}
        </span>
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
          {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;