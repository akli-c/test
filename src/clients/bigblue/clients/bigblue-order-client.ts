import axios, { AxiosError } from "axios";
import {
  BigBlueGetOrderResponse,
  BigBlueListOrdersResponse,
  BigBlueOrder,
  BigBlueOrderCreation,
  BigBluePostOrderBody,
} from "../types/bigblue-order-types";

export class BigBlueOrderClient {
  bearer_: string;

  constructor(bearer: string) {
    this.bearer_ = bearer;
  }

  async getOrders(dateFrom: Date, dateTo: Date): Promise<BigBlueOrder[]> {
    try {
      const url = process.env.BIGBLUE_URL + "/ListOrders";

      const config = {
        headers: { Authorization: `Bearer ${this.bearer_}` },
      };

      let orders = new Array<BigBlueOrder>();

      let body: any = {
        date_range: {
          from: dateFrom.toJSON(),
          to: dateTo.toJSON(),
        },
        page_size: 500,
      };

      let nextPageToken = "";

      // responses are paginated
      // use nextPageToken to request next pages

      do {
        body.page_token = nextPageToken;

        let response = await axios.post<BigBlueListOrdersResponse>(
          url,
          body,
          config
        );
        const orderResponse = response.data;

        if (orderResponse.orders?.length) {
          orders.push(...orderResponse.orders);
        }
        nextPageToken = orderResponse.next_page_token;
      } while (nextPageToken && nextPageToken.length > 0);

      return orders;
    } catch (error) {
      console.error("Failed to retrieve orders from BigBlue", error);
    }

    return [];
  }

  async getOrder(orderRef: string): Promise<BigBlueOrder | undefined> {
    try {
      const url = process.env.BIGBLUE_URL + "/GetOrder";

      const config = {
        headers: { Authorization: `Bearer ${this.bearer_}` },
      };

      const body: any = {
        id: orderRef,
      };

      let response = await axios.post<BigBlueGetOrderResponse>(
        url,
        body,
        config
      );

      const orderResponse = response.data;
      return orderResponse.order;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          `Failed to retrieve order ${orderRef} from BigBlue`,
          axiosError.response?.data
        );
      } else {
        console.error(
          `Failed to retrieve order ${orderRef} from BigBlue`,
          error
        );
      }
    }

    return undefined;
  }

  async createOrder(
    order: BigBlueOrderCreation
  ): Promise<BigBlueOrder | undefined> {
    try {
      const url = process.env.BIGBLUE_URL + "/CreateOrder";

      const config = {
        headers: { Authorization: `Bearer ${this.bearer_}` },
      };

      const body: BigBluePostOrderBody = {
        order: order,
      };

      let response = await axios.post<BigBlueGetOrderResponse>(
        url,
        body,
        config
      );

      const orderResponse = response.data;
      return orderResponse.order;

      return undefined;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(`Failed to create order into BigBlue`, axiosError);
      } else {
        console.error(`Failed to create order into BigBlue`, error);
      }
    }

    return undefined;
  }
}
