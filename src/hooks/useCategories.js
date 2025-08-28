import { useState, useEffect } from "react";
import categoriesService from "@/services/api/categoriesService";
import { toast } from "react-toastify";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const categoriesData = await categoriesService.getAll();
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const newCategory = await categoriesService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success("Category created successfully!");
      return newCategory;
    } catch (err) {
      toast.error("Failed to create category");
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const updatedCategory = await categoriesService.update(id, updates);
      setCategories(prev => prev.map(cat => 
        cat.Id === id ? updatedCategory : cat
      ));
      toast.success("Category updated successfully!");
      return updatedCategory;
    } catch (err) {
      toast.error("Failed to update category");
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoriesService.delete(id);
      setCategories(prev => prev.filter(cat => cat.Id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
      throw err;
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: loadCategories
  };
};