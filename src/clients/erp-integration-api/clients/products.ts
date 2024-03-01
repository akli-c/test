import axios from "axios";
import {
  PostProductsBody,
  Product,
  ProductVariant,
  ProductVariantExternalSku,
  ProductVariantUpdate,
} from "../types/product-types";

export class ErpProductClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateProducts(products: Product[]): Promise<void> {
    try {
      const productBody: PostProductsBody = {
        products: products,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/products";

      const config = {
        headers: {
          "X-API-KEY": this.apiKey_,
        },
      };

      await axios.post(url, productBody, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to update or create products:",
          error.status,
          error.response
        );
      } else {
        console.error("Failed to update or create products", error);
      }
      throw error;
    }
  }

  async updateVariant(
    sku: string,
    variant: ProductVariantUpdate
  ): Promise<void> {
    try {
      const url =
        (process.env.ERP_API_URL as string) + `catalog/variants/${sku}`;

      const config = {
        headers: {
          "X-API-KEY": this.apiKey_,
        },
      };

      await axios.post(url, variant, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Failed to update variant ${sku}:`,
          error.status,
          error.response
        );
      } else {
        console.error(`Failed to update variant ${sku}:`, error);
      }
      throw error;
    }
  }

  async updateVariants(variants: ProductVariant[]): Promise<void> {
    try {
      const url = (process.env.ERP_API_URL as string) + `catalog/variants`;

      const config = {
        headers: {
          "X-API-KEY": this.apiKey_,
        },
      };

      const body = {
        variants: variants,
      };

      await axios.post(url, body, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Failed to update variants:`,
          error.response?.data?.message
        );
      } else {
        console.error(`Failed to update variants`, error);
      }
      throw error;
    }
  }

  async updateVariantExternalSkus(
    externalSkus: ProductVariantExternalSku[]
  ): Promise<void> {
    try {
      const url =
        (process.env.ERP_API_URL as string) + `catalog/variant-external-skus`;

      const config = {
        headers: {
          "X-API-KEY": this.apiKey_,
        },
      };

      const body = {
        external_skus: externalSkus,
      };

      await axios.post(url, body, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Failed to update variants external skus:`,
          error.status,
          error.response?.data?.message
        );
      } else {
        console.error(`Failed to update variant external skus:`, error);
      }
      throw error;
    }
  }
}
