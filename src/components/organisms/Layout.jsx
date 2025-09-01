import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import TaskModal from "@/components/organisms/TaskModal";
import CategoryModal from "@/components/organisms/CategoryModal";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const { createCategory, updateCategory } = useCategories();
const { tasks: allTasks, createTask, updateTask, calculateStats } = useTasks("all");

  // Filter tasks for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayTasks = allTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate >= today && taskDate < tomorrow;
  });

  // Calculate today-specific stats with productivity metrics
  const stats = {
    total: todayTasks.length,
    completed: todayTasks.filter(task => task.completed).length,
    pending: todayTasks.filter(task => !task.completed).length,
    highPriority: todayTasks.filter(task => task.priority === "high" && !task.completed).length,
    highPriorityCompleted: todayTasks.filter(task => task.priority === "high" && task.completed).length,
    weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
    velocity: 0,
    avgCompletionTime: 0
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryToggle = useCallback((category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const handlePriorityToggle = useCallback((priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  }, []);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSubmitTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.Id, taskData);
    } else {
      await createTask(taskData);
    }
  };
const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  }, []);

  const handleEditCategory = useCallback((category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  }, []);

  const handleSubmitCategory = useCallback(async (categoryData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.Id, categoryData);
      } else {
        await createCategory(categoryData);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      throw error;
    }
  }, [editingCategory, createCategory, updateCategory]);

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  return (
<div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar
        stats={stats}
        onAddCategory={handleAddCategory}
        selectedCategories={selectedCategories}
        selectedPriorities={selectedPriorities}
        onCategoryToggle={handleCategoryToggle}
        onPriorityToggle={handlePriorityToggle}
        className="hidden lg:block w-80 flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onSearch={handleSearch}
          onCreateTask={handleCreateTask}
        />

        {/* Page Content */}
        <main className="flex-1 p-6">
<Outlet context={{
            searchQuery,
            selectedCategories,
            selectedPriorities,
            onEditTask: handleEditTask,
            onEditCategory: handleEditCategory,
            stats
          }} />
        </main>
      </div>
{/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={handleCloseCategoryModal}
        onSubmit={handleSubmitCategory}
      />
    </div>
  );
};

export default Layout;