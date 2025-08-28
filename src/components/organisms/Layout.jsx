import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import TaskModal from "@/components/organisms/TaskModal";
import { useTasks } from "@/hooks/useTasks";

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks: allTasks, createTask, updateTask } = useTasks("all");

  // Calculate stats
  const stats = {
    total: allTasks.length,
    completed: allTasks.filter(task => task.completed).length,
    pending: allTasks.filter(task => !task.completed).length,
    highPriority: allTasks.filter(task => task.priority === "high" && !task.completed).length
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <Sidebar
        stats={stats}
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
    </div>
  );
};

export default Layout;