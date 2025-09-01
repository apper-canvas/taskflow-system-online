class CategoriesService {
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database fields to UI format
      const categories = response.data.map(category => ({
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE9',
        icon: category.icon_c || 'Tag'
      }));

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('category_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Category with id ${id} not found`);
      }

      // Transform database fields to UI format
      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE9',
        icon: category.icon_c || 'Tag'
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Transform UI data to database fields (only Updateable fields)
      const dbCategory = {
        Name: categoryData.name || '',
        color_c: categoryData.color || '#5B4FE9',
        icon_c: categoryData.icon || 'Tag'
      };

      const params = {
        records: [dbCategory]
      };
      
      const response = await this.apperClient.createRecord('category_c', params);
      
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
            name: created.Name || '',
            color: created.color_c || '#5B4FE9',
            icon: created.icon_c || 'Tag'
          };
        }
      }
    } catch (error) {
      console.error("Error creating category:", error);
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
      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color_c = updates.color;
      if (updates.icon !== undefined) dbUpdates.icon_c = updates.icon;

      const params = {
        records: [dbUpdates]
      };
      
      const response = await this.apperClient.updateRecord('category_c', params);
      
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
            name: updated.Name || '',
            color: updated.color_c || '#5B4FE9',
            icon: updated.icon_c || 'Tag'
          };
        }
      }
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('category_c', params);
      
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
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

// Export singleton instance
const categoriesService = new CategoriesService();
export default categoriesService;
