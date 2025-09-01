class TasksService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "recurrence_pattern_c"}},
          {"field": {"Name": "recurrence_interval_c"}},
          {"field": {"Name": "recurrence_end_type_c"}},
          {"field": {"Name": "recurrence_end_date_c"}},
          {"field": {"Name": "recurrence_end_after_c"}},
          {"field": {"Name": "parent_recurring_task_id_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "productivity_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to UI format
      const tasks = response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        category: task.category_c || 'work',
        dueDate: task.due_date_c || '',
        completed: task.completed_c || false,
        createdAt: task.created_at_c || '',
        completedAt: task.completed_at_c || null,
        isRecurring: task.is_recurring_c || false,
        recurrencePattern: task.recurrence_pattern_c || null,
        recurrenceInterval: task.recurrence_interval_c || null,
        recurrenceEndType: task.recurrence_end_type_c || null,
        recurrenceEndDate: task.recurrence_end_date_c || null,
        recurrenceEndAfter: task.recurrence_end_after_c || null,
        parentRecurringTaskId: task.parent_recurring_task_id_c || null,
        estimatedTime: task.estimated_time_c || null,
        actualTime: task.actual_time_c || null,
        productivity: task.productivity_c || null
      }));

      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "is_recurring_c"}},
          {"field": {"Name": "recurrence_pattern_c"}},
          {"field": {"Name": "recurrence_interval_c"}},
          {"field": {"Name": "recurrence_end_type_c"}},
          {"field": {"Name": "recurrence_end_date_c"}},
          {"field": {"Name": "recurrence_end_after_c"}},
          {"field": {"Name": "parent_recurring_task_id_c"}},
          {"field": {"Name": "estimated_time_c"}},
          {"field": {"Name": "actual_time_c"}},
          {"field": {"Name": "productivity_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Task with id ${id} not found`);
      }

      // Transform database fields to UI format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        category: task.category_c || 'work',
        dueDate: task.due_date_c || '',
        completed: task.completed_c || false,
        createdAt: task.created_at_c || '',
        completedAt: task.completed_at_c || null,
        isRecurring: task.is_recurring_c || false,
        recurrencePattern: task.recurrence_pattern_c || null,
        recurrenceInterval: task.recurrence_interval_c || null,
        recurrenceEndType: task.recurrence_end_type_c || null,
        recurrenceEndDate: task.recurrence_end_date_c || null,
        recurrenceEndAfter: task.recurrence_end_after_c || null,
        parentRecurringTaskId: task.parent_recurring_task_id_c || null,
        estimatedTime: task.estimated_time_c || null,
        actualTime: task.actual_time_c || null,
        productivity: task.productivity_c || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI data to database fields (only Updateable fields)
      const dbTask = {
        Name: taskData.title || '',
        title_c: taskData.title || '',
        description_c: taskData.description || '',
        priority_c: taskData.priority || 'medium',
        category_c: taskData.category || 'work',
        due_date_c: taskData.dueDate || '',
        completed_c: false,
        created_at_c: new Date().toISOString(),
        completed_at_c: null,
        is_recurring_c: taskData.isRecurring || false,
        recurrence_pattern_c: taskData.recurrencePattern || null,
        recurrence_interval_c: taskData.recurrenceInterval || null,
        recurrence_end_type_c: taskData.recurrenceEndType || null,
        recurrence_end_date_c: taskData.recurrenceEndDate || null,
        recurrence_end_after_c: taskData.recurrenceEndAfter || null,
        parent_recurring_task_id_c: taskData.parentRecurringTaskId || null,
        estimated_time_c: taskData.estimatedTime || null,
        actual_time_c: null,
        productivity_c: null
      };

      const params = {
        records: [dbTask]
      };
      
      const response = await this.apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to UI format
          return {
            Id: created.Id,
            title: created.title_c || '',
            description: created.description_c || '',
            priority: created.priority_c || 'medium',
            category: created.category_c || 'work',
            dueDate: created.due_date_c || '',
            completed: created.completed_c || false,
            createdAt: created.created_at_c || '',
            completedAt: created.completed_at_c || null,
            isRecurring: created.is_recurring_c || false,
            recurrencePattern: created.recurrence_pattern_c || null,
            recurrenceInterval: created.recurrence_interval_c || null,
            recurrenceEndType: created.recurrence_end_type_c || null,
            recurrenceEndDate: created.recurrence_end_date_c || null,
            recurrenceEndAfter: created.recurrence_end_after_c || null,
            parentRecurringTaskId: created.parent_recurring_task_id_c || null,
            estimatedTime: created.estimated_time_c || null,
            actualTime: created.actual_time_c || null,
            productivity: created.productivity_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI updates to database fields (only Updateable fields)
      const dbUpdates = {
        Id: parseInt(id)
      };

      // Map UI fields to database fields
      if (updates.title !== undefined) dbUpdates.title_c = updates.title;
      if (updates.description !== undefined) dbUpdates.description_c = updates.description;
      if (updates.priority !== undefined) dbUpdates.priority_c = updates.priority;
      if (updates.category !== undefined) dbUpdates.category_c = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date_c = updates.dueDate;
      if (updates.completed !== undefined) {
        dbUpdates.completed_c = updates.completed;
        dbUpdates.completed_at_c = updates.completed ? new Date().toISOString() : null;
        
        // Calculate productivity if completing task
        if (updates.completed && updates.createdAt) {
          const created = new Date(updates.createdAt);
          const completed = new Date();
          const actualTime = Math.round((completed - created) / (1000 * 60 * 60));
          dbUpdates.actual_time_c = actualTime;
          
          if (updates.estimatedTime) {
            dbUpdates.productivity_c = Math.round((updates.estimatedTime / actualTime) * 100);
          }
        }
      }
      if (updates.isRecurring !== undefined) dbUpdates.is_recurring_c = updates.isRecurring;
      if (updates.recurrencePattern !== undefined) dbUpdates.recurrence_pattern_c = updates.recurrencePattern;
      if (updates.recurrenceInterval !== undefined) dbUpdates.recurrence_interval_c = updates.recurrenceInterval;
      if (updates.recurrenceEndType !== undefined) dbUpdates.recurrence_end_type_c = updates.recurrenceEndType;
      if (updates.recurrenceEndDate !== undefined) dbUpdates.recurrence_end_date_c = updates.recurrenceEndDate;
      if (updates.recurrenceEndAfter !== undefined) dbUpdates.recurrence_end_after_c = updates.recurrenceEndAfter;
      if (updates.parentRecurringTaskId !== undefined) dbUpdates.parent_recurring_task_id_c = updates.parentRecurringTaskId;
      if (updates.estimatedTime !== undefined) dbUpdates.estimated_time_c = updates.estimatedTime;
      if (updates.actualTime !== undefined) dbUpdates.actual_time_c = updates.actualTime;
      if (updates.productivity !== undefined) dbUpdates.productivity_c = updates.productivity;

      const params = {
        records: [dbUpdates]
      };
      
      const response = await this.apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to UI format
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            description: updated.description_c || '',
            priority: updated.priority_c || 'medium',
            category: updated.category_c || 'work',
            dueDate: updated.due_date_c || '',
            completed: updated.completed_c || false,
            createdAt: updated.created_at_c || '',
            completedAt: updated.completed_at_c || null,
            isRecurring: updated.is_recurring_c || false,
            recurrencePattern: updated.recurrence_pattern_c || null,
            recurrenceInterval: updated.recurrence_interval_c || null,
            recurrenceEndType: updated.recurrence_end_type_c || null,
            recurrenceEndDate: updated.recurrence_end_date_c || null,
            recurrenceEndAfter: updated.recurrence_end_after_c || null,
            parentRecurringTaskId: updated.parent_recurring_task_id_c || null,
            estimatedTime: updated.estimated_time_c || null,
            actualTime: updated.actual_time_c || null,
            productivity: updated.productivity_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async getTasksByView(view) {
    try {
      const allTasks = await this.getAll();
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
          return allTasks;
        default:
          return allTasks.filter(task => !task.completed);
      }
    } catch (error) {
      console.error("Error getting tasks by view:", error);
      throw error;
    }
  }

  async searchTasks(query) {
    try {
      if (!query.trim()) {
        return this.getAll();
      }
      
      const allTasks = await this.getAll();
      const searchTerm = query.toLowerCase();
      return allTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }

  async getTasksByCategory(category) {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.category === category);
    } catch (error) {
      console.error("Error getting tasks by category:", error);
      throw error;
    }
  }

  async getTasksByPriority(priority) {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.priority === priority);
    } catch (error) {
      console.error("Error getting tasks by priority:", error);
      throw error;
    }
  }
}

// Export singleton instance
const tasksService = new TasksService();
export default tasksService;

export default new TasksService();