import axios from "axios";
import { Category, PostCategoriesBody } from "../types/category-types";

export class ErpCategoryClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateCategories(categories: Category[]): Promise<void> {
    try {
      const productBody: PostCategoriesBody = {
        categories: categories,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/categories";

      const config = {
        headers: {
          "X-API-KEY": this.apiKey_,
        },
      };

      await axios.post(url, productBody, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to update or create categories:",
          error.status,
          error.response
        );
      } else {
        console.error("Failed to update or create categories", error);
      }
      throw error;
    }
  }
}
