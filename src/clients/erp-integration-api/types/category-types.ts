export interface PostCategoriesBody {
  /**
   * categories to update or create
   */
  categories: Category[];
}

export interface Category {
  /**
   * category handle (should be unique)
   */
  handle: string;
  /**
   * Submited language
   */
  lang?: string;
  /**
   * display name of the category
   */
  name: string;
  /**
   * category description
   */
  description?: string;
  /**
   * category rank for ordering
   */
  rank?: number;
  /**
   * handle of the parent category if any
   */
  parent_handle?: string;
}
