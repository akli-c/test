import axios, { AxiosError } from "axios";
import {
  BigBlueInventories,
  BigBlueListInventoriesResponse,
  BigBlueListProductsResponse,
  BigBlueProduct,
} from "../types/bigblue-product-types";

export class BigBlueProductClient {
  bearer_: string;

  constructor(bearer: string) {
    this.bearer_ = bearer;
  }

  async getProducts(): Promise<BigBlueProduct[]> {
    try {
      const url = process.env.BIGBLUE_URL + "/ListProducts";

      const config = {
        headers: { Authorization: `Bearer ${this.bearer_}` },
      };

      let products = new Array<BigBlueProduct>();

      let body: any = {
        page_size: 100,
      };

      let nextPageToken = "";

      // responses are paginated
      // use nextPageToken to request next pages

      do {
        body.page_token = nextPageToken;

        let response = await axios.post<BigBlueListProductsResponse>(
          url,
          body,
          config
        );
        const productsResponse = response.data;

        if (productsResponse.products?.length) {
          products.push(...productsResponse.products);
        }
        nextPageToken = productsResponse.next_page_token;
      } while (nextPageToken && nextPageToken.length > 0);

      return products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          `Failed to get products from BigBlue`,
          axiosError.response?.data
        );
      } else {
        console.error(`Failed to get products from BigBlue`, error);
      }
    }
    return [];
  }

  async getInventories(): Promise<BigBlueInventories[]> {
    try {
      const url = process.env.BIGBLUE_URL + "/ListInventories";

      const config = {
        headers: { Authorization: `Bearer ${this.bearer_}` },
      };

      let inventories = new Array<BigBlueInventories>();

      let body: any = {
        page_size: 100,
      };

      let nextPageToken = "";

      // responses are paginated
      // use nextPageToken to request next pages

      do {
        body.page_token = nextPageToken;

        let response = await axios.post<BigBlueListInventoriesResponse>(
          url,
          body,
          config
        );
        const productsResponse = response.data;

        if (productsResponse.inventories?.length) {
          inventories.push(...productsResponse.inventories);
        }
        nextPageToken = productsResponse.next_page_token;
      } while (nextPageToken && nextPageToken.length > 0);

      return inventories;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          `Failed to get inventories from BigBlue`,
          axiosError.response?.data
        );
      } else {
        console.error(`Failed to get inventories from BigBlue`, error);
      }
    }
    return [];
  }
}
