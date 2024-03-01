export const X_API_KEY_HEADER = "X-API-KEY";

export const DEFAULT_CURRENCY_CODE = "eur";
export const AMOUNT_FACTOR = 100;

export const PRODUCT_IMPORT_BATCH_SIZE: number = 50;
export const VARIANT_IMPORT_BATCH_SIZE: number = 10;
export const ORDER_IMPORT_BATCH_SIZE: number = 10;
export const EXTERNAL_SKU_BATCH_SIZE: number = 50;
export const COMPANY_IMPORT_BATCH_SIZE: number = 100;
export const CATALOG_IMPORT_BATCH_SIZE: number = 1;

// BigBlue
export const BIGBLUE_EVENT_TYPE_HEADER = "x-bigblue-event-type";
export const BIGBLUE_EVENT_SIGNATURE_HEADER = "x-bigblue-hmac-sha256";
export const BIGBLUE_EVENT_URL_VERIFICATION = "URL_VERIFICATION";
export const BIGBLUE_TRACKING_URL = "https://app.bigblue.co/orders";
export const BIGBLUE_TRACKING_NAME = "Bigblue";

export class OrderConstants {
  static readonly Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
    SHIPMENT_CREATED: "order.shipment_created",
    FULFILLMENT_CREATED: "order.fulfillment_created",
    FULFILLMENT_CANCELED: "order.fulfillment_canceled",
    RETURN_REQUESTED: "order.return_requested",
    ITEMS_RETURNED: "order.items_returned",
    RETURN_ACTION_REQUIRED: "order.return_action_required",
    REFUND_CREATED: "order.refund_created",
    REFUND_FAILED: "order.refund_failed",
    SWAP_CREATED: "order.swap_created",
    PLACED: "order.placed",
    UPDATED: "order.updated",
    CANCELED: "order.canceled",
    COMPLETED: "order.completed",
    REJECTED: "order.rejected",
    SELLER_ORDER_ID_CREATED: "order.seller_order_id_created",
    IMPORTED: "order.imported",
  };
}
