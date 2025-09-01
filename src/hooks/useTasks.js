import { useState, useEffect } from "react";
import tasksService from "@/services/api/tasksService";
import { toast } from "react-toastify";
import { format, subDays, isWithinInterval } from "date-fns";

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
        // Include all tasks for comprehensive statistics
        // tasksData = tasksData.filter(task => !task.completed);
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
          toast.success("Task completed! Great job! 🎉", {
            position: "top-right",
            autoClose: 3000
          });
          // Remove from current view if it's not the completed view
          if (view !== "completed" && view !== "all") {
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

// Calculate enhanced statistics with productivity metrics
  const calculateStats = (allTasks) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const weekAgo = subDays(now, 7);
    
    // Basic stats
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const highPriority = allTasks.filter(task => task.priority === "high" && !task.completed).length;
    const highPriorityCompleted = allTasks.filter(task => task.priority === "high" && task.completed).length;
    
    // Weekly completion data for chart
    const weeklyCompletion = [];
    for (let i = 6; i >= 0; i--) {
      const day = format(subDays(now, i), 'yyyy-MM-dd');
      const completedOnDay = allTasks.filter(task => 
        task.completed && task.completedAt && task.completedAt.startsWith(day)
      ).length;
      weeklyCompletion.push(completedOnDay);
    }
// Task velocity (average tasks completed per day over last 7 days)
    const recentCompletions = allTasks.filter(task => 
      task.completed && task.completedAt && 
      new Date(task.completedAt) >= weekAgo
    );
    const velocity = Math.round((recentCompletions.length / 7) * 10) / 10;
    
    // Average completion time estimation (mock calculation)
    const avgCompletionTime = Math.round((recentCompletions.length > 0 ? 2.5 : 0) * 10) / 10;
    
    return {
      total,
      completed,
      pending,
      highPriority,
      highPriorityCompleted,
      weeklyCompletion,
      velocity,
      avgCompletionTime,
      totalChange: 0, // Could be calculated from historical data
      completedChange: Math.max(weeklyCompletion[6] - weeklyCompletion[5], 0),
      pendingChange: 0,
      highPriorityChange: 0
    };
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    searchTasks,
    refetch: loadTasks,
    calculateStats
  };
};