import { useState, useEffect } from "react";
import tasksService from "@/services/api/tasksService";
import { toast } from "react-toastify";

export const useTasks = (view = "all") => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      let tasksData;
      if (view === "all") {
        tasksData = await tasksService.getAll();
        tasksData = tasksData.filter(task => !task.completed);
      } else {
        tasksData = await tasksService.getTasksByView(view);
      }
      
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task created successfully!");
      return newTask;
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await tasksService.update(id, updates);
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ));
      
      if (updates.completed !== undefined) {
        if (updates.completed) {
          toast.success("Task completed! Great job! 🎉");
          // Remove from current view if it's not the completed view
          if (view !== "completed") {
            setTasks(prev => prev.filter(task => task.Id !== id));
          }
        } else {
          toast.info("Task marked as incomplete");
        }
      } else {
        toast.success("Task updated successfully!");
      }
      
      return updatedTask;
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      throw err;
    }
  };

  const toggleTaskComplete = async (id) => {
    const task = tasks.find(t => t.Id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const searchTasks = async (query) => {
    try {
      setLoading(true);
      setError("");
      const searchResults = await tasksService.searchTasks(query);
      setTasks(searchResults);
    } catch (err) {
      setError(err.message || "Failed to search tasks");
      toast.error("Failed to search tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [view]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    searchTasks,
    refetch: loadTasks
  };
};