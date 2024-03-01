import { Address } from "./address-types";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  ARCHIVED = "archived",
  CANCELED = "canceled",
  REJECTED = "rejected",
  REQUIRES_ACTION = "requires_action",
}

export enum FulfillmentStatus {
  NOT_FULFILLED = "not_fulfilled",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  PARTIALLY_SHIPPED = "partially_shipped",
  SHIPPED = "shipped",
  PARTIALLY_RETURNED = "partially_returned",
  RETURNED = "returned",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  CAPTURED = "captured",
  PARTIALLY_REFUNDED = "partially_refunded",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export interface PostOrderBody {
  /*
   * catalog order id
   */
  id?: string;

  /*
   * seller order id : reference of the order in the external system
   */
  seller_order_id: string;

  /**
   * external id : reference of the order in the system of the customer
   */
  external_id?: string;

  /**
   * order status : pending, completed, archived, canceled, requires_action, rejected
   */
  status?: OrderStatus;

  /**
   * payment status : not_paid, awaiting, captured, partially_refunded, refunded, canceled, requires_action
   */
  payment_status?: PaymentStatus;

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
   * use company_name if neither email set nor company_code set ; take the first customer of the company to affect the order
   */
  company_name?: string;

  /**
   * billing address
   */
  billing_address?: Address;

  /**
   * shipping address
   */
  shipping_address?: Address;

  /**
   * currency code
   */
  currency_code?: string;

  /**
   * tax rate
   */
  tax_rate?: number;

  /**
   * items of the order
   */
  items?: LineItem[];

  /**
   * url of the order receipt ; generally set when order is validated (= status completed)
   */
  receipt_url?: string;

  /**
   * url of the delivery note
   */
  delivery_note_url?: string;

  /**
   * url of the invoice note
   */
  invoice_url?: string;

  /**
   * if true, keep the original invoice url
   * default false
   */
  keep_original_invoice_url?: boolean;

  /**
   * delivery date requested by the customer ; format is YYYY-MM-DD
   */
  requested_delivery_date?: string;

  /**
   * validated date by the seller ; format is YYYY-MM-DD
   */
  validated_date?: string;

  /**
   * global discounts
   */
  global_discounts?: GlobalDiscount[];

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
   * order creation date
   */
  creation_date?: string;

  /**
   * erp tracking url
   */
  erp_tracking_name?: string;

  /**
   * erp tracking url
   */
  erp_tracking_url?: string;

  /**
   * display id
   */
  display_id?: number;
}

export interface GlobalDiscount {
  name?: string;
  amount?: number;
  code?: string;
}

export interface LineItem {
  /**
   * sku of the variant
   */
  variant_sku: string;

  /**
   * quantity of the variant in the order
   */
  quantity: number;

  /**
   * unit price of the variant
   */
  unit_price: number;
  /**
   * fulfilled quantity of the variant
   */
  fulfilled_quantity?: number;

  /**
   * shipped quantity of the variant
   */
  shipped_quantity?: number;
}

export interface PostOrdersBody {
  /**
   * order to create
   */
  orders: PostOrderBody[];
}

export interface OrderChangeNotification {
  /**
   * event type
   */
  event: string;

  /**
   * order id
   */
  order_id: string;

  /**
   * order display id
   */
  display_id: number;

  /**
   * external id
   */
  external_id?: string;

  /**
   * seller order id
   */
  seller_order_id?: string;

  /**
   * order status : pending, completed, archived, canceled, requires_action, rejected
   */
  status?: OrderStatus;

  /**
   * fulfillment status : not_fulfilled, partially_fulfilled, fulfilled, partially_shipped, shipped, partially_returned, returned, canceled, requires_action
   */
  fulfillment_status?: FulfillmentStatus;

  /**
   * payment status : not_paid, awaiting, captured, partially_refunded, refunded, canceled, requires_action
   */
  payment_status?: PaymentStatus;

  /**
   * company name
   */
  company_name: string;

  /**
   * company id
   */
  company_id: string;

  /**
   * company external id ; id of the company in the seller's system
   */
  company_external_id?: string;

  /**
   * customer email
   */
  email: string;

  /**
   * delivery date
   */
  delivery_date?: string;

  /**
   * order items
   */
  items: OrderChangeItem[];

  /**
   * shipping address
   */
  shipping_address: OrderChangeAddress;

  /**
   * billing address
   */
  billing_address: OrderChangeAddress;

  /**
   * currency_code
   */
  currency_code: string;

  /**
   * shipping price
   */
  shipping_price: number;

  /**
   * shipping tax
   */
  shipping_tax: number;

  /**
   * shipping tax rate
   */
  shipping_tax_rate: number;

  /**
   * shipping method
   */
  shipping_method: string;
  /**
   * order comment
   */
  comment: string;

  /**
   * order creation date
   */
  creation_date: string;
}

export interface OrderChangeAddress {
  /**
   * address name
   */
  label?: string;
  /**
   * address first name
   */
  first_name?: string;
  /**
   * address last name
   */
  last_name?: string;
  /**
   * address street 1
   */
  address_1?: string;
  /**
   * address street 2
   */
  address_2?: string;
  /**
   * address postal code
   */
  postal_code?: string;
  /**
   * address city
   */
  city?: string;
  /**
   * address country code
   */
  country_code?: string;
  /**
   * country
   */
  country?: string;
}

export interface OrderChangeItem {
  /**
   * variant sku
   */
  sku: string;

  /**
   * unit price
   */
  unit_price: number;

  /**
   * quantity
   */
  quantity: number;

  /**
   * unit tax
   */
  unit_tax: number;

  /**
   * alternative sku
   */
  alternative_sku?: string;

  /**
   * variant name
   */
  title: string;

  /**
   * tax rate
   */
  tax_rate: number;
}

export interface ShippingMethod {
  /**
   * name of the shipping method
   */
  name: string;

  /**
   * price of the shipping method
   */
  price?: number;

  /**
   * packaging price
   */
  packaging_price?: number;
}
