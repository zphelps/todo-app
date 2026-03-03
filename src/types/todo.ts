export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  categoryId?: string;
  subCategoryId?: string;
}

export type FilterType = 'all' | 'active' | 'completed';
