import axios from "axios";
import { Catalog, PostCatalogsBody } from "../types/catalog-types";
import { X_API_KEY_HEADER } from "../../../constants";

export class ErpCatalogClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateCatalogs(catalogs: Catalog[]): Promise<void> {
    try {
      const catalogBody: PostCatalogsBody = {
        catalogs: catalogs,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/catalogs";

      const config = {
        headers: {
          [X_API_KEY_HEADER]: this.apiKey_,
        },
      };

      await axios.post(url, catalogBody, config);

      console.info("Successfully updated or created catalogs");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to update or create catalogs:",
          error.status,
          error.response
        );
      } else {
        console.error("Failed to update or create catalogs", error);
      }
      throw error;
    }
  }
}
