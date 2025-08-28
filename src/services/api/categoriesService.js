import categoriesData from "@/services/mockData/categories.json";

class CategoriesService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await this.delay(150);
    const category = this.categories.find(cat => cat.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return { ...category };
  }

  async create(categoryData) {
    await this.delay(300);
    const newCategory = {
      Id: this.getNextId(),
      ...categoryData
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await this.delay(250);
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...updates
    };
    
    return { ...this.categories[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`);
    }
    this.categories.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = this.categories.reduce((max, cat) => 
      cat.Id > max ? cat.Id : max, 0
    );
    return maxId + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CategoriesService();