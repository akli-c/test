import axios, { AxiosError } from "axios";
import { PostQuoteBody, PostQuotesBody } from "../types/quote-types";
import { X_API_KEY_HEADER } from "../../../constants";

export class ErpQuoteClient {
  private apiKey_: string;

  constructor(apiKey: string) {
    this.apiKey_ = apiKey;
  }

  async updateOrCreateQuotes(quotes: PostQuoteBody[]): Promise<void> {
    try {
      const quoteBody: PostQuotesBody = {
        quotes: quotes,
      };

      const url = (process.env.ERP_API_URL as string) + "catalog/quotes";

      const config = {
        headers: {
          [X_API_KEY_HEADER]: this.apiKey_,
        },
      };

      await axios.post(url, quoteBody, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          "Failed to update or create qotes:",
          axiosError.code,
          axiosError.message
        );
      } else {
        console.error("Failed to update or create quotes", error);
      }
      throw error;
    }
  }
}
