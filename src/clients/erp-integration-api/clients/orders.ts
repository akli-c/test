import axios, { AxiosError } from "axios";
import { PostOrderBody, PostOrdersBody } from "../types/order-types";
import { X_API_KEY_HEADER } from "../../../constants";

export class ErpOrderClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateOrders(orders: PostOrderBody[]): Promise<void> {
    try {
      const orderBody: PostOrdersBody = {
        orders: orders,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/orders";

      const config = {
        headers: {
          [X_API_KEY_HEADER]: this.apiKey_,
        },
      };

      await axios.post(url, orderBody, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.warn("Failed to update or create orders:", axiosError);
        throw new Error(
          `Failed to update order : ${axiosError.response?.data}`
        );
      } else {
        console.error("Failed to update or create orders", error);
        throw error;
      }
    }
  }
}
