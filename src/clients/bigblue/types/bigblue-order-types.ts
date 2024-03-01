export interface BigBlueListOrdersResponse {
  orders: BigBlueOrder[];
  next_page_token: string;
}

export interface BigBlueGetOrderResponse {
  order: BigBlueOrder;
}

export interface BigBlueOrder {
  id: string;
  external_id: string;
  store: string;
  submit_time: string;
  language: string;
  currency: string;
  shipping_address: BigBlueShippingAddress;
  line_items: BigBlueLineItem[];
  shipping_price: string;
  shipping_tax: string;
  additional_tax: string;
  additional_discount: string;
  total: string;
  billing_address: BigBlueBillingAddress;
  status: BigBlueOrderStatus;
  shipping_method?: string;
  pickup_point?: BligBluePickupPoint;
}

export interface BigBlueShippingAddress {
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  email: string;
  line1: string;
  city: string;
  postal?: string;
  state?: string;
  country: string;
  line2?: string;
}

export interface BigBlueLineItem {
  product: string;
  quantity: number;
  unit_price: string;
  unit_tax: string;
  discount?: string;
}

export interface BigBlueBillingAddress {
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;
  line1: string;
  city: string;
  postal?: string;
  country: string;
  line2?: string;
}

export interface BigBlueOrderStatus {
  code: BigBlueOrderStatusCode;
  message: string;
}

export enum BigBlueOrderStatusCode {
  BACKORDER = "BACKORDER",
  PENDING = "PENDING",
  EXCEPTION = "EXCEPTION",
  IN_PREPARATION = "IN_PREPARATION",
  HANDED_OVER = "HANDED_OVER",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

export interface BligBluePickupPoint {
  id: string;
  display_name: string;
  postal: string;
  country: string;
  carrier_service: string;
}

export interface BigBluePostOrderBody {
  order: BigBlueOrderCreation;
}

export interface BigBlueOrderCreation {
  id?: string;
  external_id?: string;
  language: string;
  currency: string;
  shipping_address: BigBlueShippingAddress;
  line_items: BigBlueLineItem[];
  shipping_price: string;
  shipping_tax: string;
  additional_tax?: string;
  additional_discount?: string;
  shipping_method?: string;
  billing_address?: BigBlueBillingAddress;
  pickup_point?: BigBluePickupPoint;
}

export interface BigBluePickupPoint {
  id: string;
  display_name: string;
  postal: string;
  state: string;
  country: string;
  carrier_service: string;
}

export interface BigBlueOrderStatusUpdateBody {
  update_time: Date;
  order_status: BigBlueOrderStatusUpdate;
}

export interface BigBlueOrderStatusUpdate {
  id: string;
  external_id: string;
  carrier: string;
  code: BigBlueOrderStatusCode;
  tracking_number: string;
  tracking_url: string;
}
