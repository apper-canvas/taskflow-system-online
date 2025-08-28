import tasksData from "@/services/mockData/tasks.json";

class TasksService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(200);
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

  async create(taskData) {
await this.delay(400);
    const newTask = {
Id: this.getNextId(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      // Productivity tracking
      estimatedTime: taskData.estimatedTime || null,
      actualTime: null,
      productivity: null,
      // Recurrence fields
      isRecurring: taskData.isRecurring || false,
      recurrencePattern: taskData.recurrencePattern || null,
      recurrenceInterval: taskData.recurrenceInterval || null,
      recurrenceEndType: taskData.recurrenceEndType || null,
      recurrenceEndDate: taskData.recurrenceEndDate || null,
      recurrenceEndAfter: taskData.recurrenceEndAfter || null,
      parentRecurringTaskId: taskData.parentRecurringTaskId || null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await this.delay(300);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates
};
    
    // Handle recurrence field updates
    if (updates.isRecurring !== undefined) {
      this.tasks[index].isRecurring = updates.isRecurring;
      this.tasks[index].recurrencePattern = updates.recurrencePattern || null;
      this.tasks[index].recurrenceInterval = updates.recurrenceInterval || null;
      this.tasks[index].recurrenceEndType = updates.recurrenceEndType || null;
      this.tasks[index].recurrenceEndDate = updates.recurrenceEndDate || null;
      this.tasks[index].recurrenceEndAfter = updates.recurrenceEndAfter || null;
    }
    
if (updates.completed !== undefined) {
      this.tasks[index].completedAt = updates.completed 
        ? new Date().toISOString() 
        : null;
      
      // Calculate productivity metrics when task is completed
      if (updates.completed && this.tasks[index].createdAt) {
        const created = new Date(this.tasks[index].createdAt);
        const completed = new Date();
        const actualTime = Math.round((completed - created) / (1000 * 60 * 60)); // hours
        this.tasks[index].actualTime = actualTime;
        
        if (this.tasks[index].estimatedTime) {
          this.tasks[index].productivity = Math.round(
            (this.tasks[index].estimatedTime / actualTime) * 100
          );
        }
      }
    }
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    this.tasks.splice(index, 1);
    return true;
  }

async getTasksByView(view) {
    await this.delay(300);
    const allTasks = [...this.tasks];
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    switch (view) {
      case "today":
        return allTasks.filter(task => 
          !task.completed && task.dueDate === todayStr
        );
      case "upcoming":
        return allTasks.filter(task => 
          !task.completed && 
          task.dueDate > todayStr && 
          task.dueDate <= nextWeekStr
        );
      case "completed":
        return allTasks.filter(task => task.completed);
      case "all":
        return allTasks; // Return all tasks for comprehensive statistics
      default:
        return allTasks.filter(task => !task.completed);
    }
  }

  // Get productivity statistics
  async getProductivityStats() {
    await this.delay(200);
    const allTasks = [...this.tasks];
    const completedTasks = allTasks.filter(task => task.completed);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentCompletions = completedTasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= weekAgo
    );
    
    return {
      totalCompleted: completedTasks.length,
      weeklyCompletions: recentCompletions.length,
      avgProductivity: completedTasks.reduce((acc, task) => 
        acc + (task.productivity || 100), 0) / (completedTasks.length || 1),
      avgCompletionTime: completedTasks.reduce((acc, task) => 
        acc + (task.actualTime || 0), 0) / (completedTasks.length || 1)
    };
  }

  async searchTasks(query) {
    await this.delay(200);
    if (!query.trim()) {
      return this.getAll();
    }
    
    const searchTerm = query.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm)
    );
  }

  async getTasksByCategory(category) {
    await this.delay(250);
    return this.tasks.filter(task => task.category === category);
  }

  async getTasksByPriority(priority) {
    await this.delay(250);
    return this.tasks.filter(task => task.priority === priority);
  }

  getNextId() {
    const maxId = this.tasks.reduce((max, task) => 
      task.Id > max ? task.Id : max, 0
    );
    return maxId + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TasksService();