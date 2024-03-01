import { Address } from "./address-types";
import { LineItem, ShippingMethod } from "./order-types";

export interface PostQuoteBody {
  /*
   * seller order id : reference of the order in the external system
   */
  seller_quote_id: string;

  /**
   * email of the order initiator
   * if not initialized, take the first customer of the company to affect the order (then company name becomes mandatory)
   */
  email?: string;

  /**
   * use company_code if no email set ; take the first customer of the company to affect the order
   */
  company_code?: string;

  /**
   * billing address
   */
  billing_address?: Address;

  /**
   * shipping address
   */
  shipping_address: Address;

  /**
   * items of the order
   */
  items: LineItem[];

  /**
   * url of the quote
   */
  quote_url?: string;

  /**
   * shipping method
   */
  shipping_method?: ShippingMethod;

  /**
   * delivery instructions*
   * TODO: manage in API
   */
  comments?: string;

  /**
   * delivery date requested by the customer ; format is YYYY-MM-DD
   */
  requested_delivery_date?: string;

  /**
   * validated date ; format is YYYY-MM-DD
   */
  validated_date?: string;
}

export interface PostQuotesBody {
  /**
   * order to create
   */
  quotes: PostQuoteBody[];
}
export { LineItem };
