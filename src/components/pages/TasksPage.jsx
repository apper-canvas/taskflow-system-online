import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import TaskList from "@/components/organisms/TaskList";
import TaskStats from "@/components/molecules/TaskStats";
import { useTasks } from "@/hooks/useTasks";

const TasksPage = ({ view = "all" }) => {
  const { 
    searchQuery, 
    selectedCategories, 
    selectedPriorities, 
    onEditTask 
  } = useOutletContext();

  const { 
    tasks, 
    loading, 
    error, 
    toggleTaskComplete, 
    deleteTask, 
    refetch 
  } = useTasks(view);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(task =>
        selectedCategories.includes(task.category)
      );
    }

    // Apply priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(task =>
        selectedPriorities.includes(task.priority)
      );
    }

    // Sort tasks by priority and due date
    filtered.sort((a, b) => {
      // First, sort by completion status (incomplete tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally, sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return filtered;
  }, [tasks, searchQuery, selectedCategories, selectedPriorities]);

  const getPageTitle = () => {
    switch (view) {
      case "today":
        return "Today's Tasks";
      case "upcoming":
        return "Upcoming Tasks";
      case "completed":
        return "Completed Tasks";
      default:
        return "All Tasks";
    }
  };

  const getPageDescription = () => {
    switch (view) {
      case "today":
        return "Tasks due today";
      case "upcoming":
        return "Tasks due within the next 7 days";
      case "completed":
        return "Tasks you've completed";
      default:
return "All your active tasks";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Task Progress Dashboard */}
      {view === "all" && (
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
              Task Progress Dashboard
            </h2>
            <p className="text-gray-600">
              Overview of your task completion and productivity metrics
            </p>
          </div>
          <TaskStats stats={useOutletContext().stats} />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
        <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
          {getPageTitle()}
        </h2>
        <p className="text-gray-600">
          {getPageDescription()}
          {filteredTasks.length > 0 && ` (${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'})`}
        </p>
</div>
      </div>

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        onToggleComplete={toggleTaskComplete}
        onEditTask={onEditTask}
        onDeleteTask={deleteTask}
        onRetry={refetch}
      />
    </div>
  );
};

export default TasksPage;