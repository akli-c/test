import { BigBlueOrderClient } from "../../clients/bigblue/clients/bigblue-order-client";
import {
  BigBlueLineItem,
  BigBlueOrder,
  BigBlueOrderCreation,
  BigBlueOrderStatusCode,
  BigBlueOrderStatusUpdate,
} from "../../clients/bigblue/types/bigblue-order-types";
import { ErpOrderClient } from "../../clients/erp-integration-api/clients/orders";
import {
  LineItem,
  OrderChangeItem,
  OrderChangeNotification,
  OrderStatus,
  PaymentStatus,
  PostOrderBody,
} from "../../clients/erp-integration-api/types/order-types";
import {
  BIGBLUE_TRACKING_NAME,
  BIGBLUE_TRACKING_URL,
  ORDER_IMPORT_BATCH_SIZE,
} from "../../constants";
import { chunkArray } from "../../utils/helpers";
import { IOrderService } from "../base-order-service";
import { BigBlueProductService } from "./bigblue-product-service";

export class BigBlueOrderService implements IOrderService {
  private readonly bigblueOrderClient_: BigBlueOrderClient;
  private readonly orderClient_: ErpOrderClient;
  private readonly skuPrefix_: string;

  constructor(
    bigBlueBearer: string,
    integrationApiKey: string,
    skuPrefix: string
  ) {
    this.bigblueOrderClient_ = new BigBlueOrderClient(bigBlueBearer);
    this.orderClient_ = new ErpOrderClient(integrationApiKey);
    this.skuPrefix_ = skuPrefix;
  }

  async updateOrCreateOrder(order: OrderChangeNotification): Promise<void> {
    let sellerOrderId: string | undefined = undefined;

    try {
      const orderStatus = order.status;
      if (orderStatus === OrderStatus.PENDING) {
        console.warn(
          "order " +
            order.order_id +
            " is pending ; don't create it ; wait for it to be validated"
        );
        return;
      }

      // don't create / update order if canceled or rejected
      if (
        orderStatus === OrderStatus.CANCELED ||
        orderStatus === OrderStatus.REJECTED
      ) {
        console.warn(
          `order ${order.order_id} is ${orderStatus} ; don't create/update it`
        );

        return;
      }

      let existingOrder: BigBlueOrder | undefined = undefined;
      sellerOrderId = order.seller_order_id;

      if (sellerOrderId) {
        existingOrder = await this.bigblueOrderClient_.getOrder(sellerOrderId);
      }

      if (existingOrder) {
        console.info(
          "order " + sellerOrderId + " already exists ; don't create"
        );
        return;
      }

      const orderToCreate = this.getOrderToCreate(order);

      console.info(
        `Creating order ${order.order_id} (external id: ${order.external_id}) in BigBlue...`,
        orderToCreate
      );

      let createdOrder = await this.bigblueOrderClient_.createOrder(
        orderToCreate
      );

      if (createdOrder) {
        console.info(
          `Successfully created order ${createdOrder.id} (external id: ${createdOrder.external_id}) in BligBlue: ${createdOrder.id}`
        );

        sellerOrderId = createdOrder.id;

        const catalogOrderToUpdate = this.getCatalogOrder(createdOrder);
        catalogOrderToUpdate.id = order.order_id;

        if (!catalogOrderToUpdate.status) {
          catalogOrderToUpdate.status = orderStatus || OrderStatus.COMPLETED;
        }

        console.info(
          `Updating order ${order.order_id} (external id: ${order.external_id}, BigBlue id : ${sellerOrderId}) in Catalog...`,
          catalogOrderToUpdate
        );

        await this.orderClient_.updateOrCreateOrders([catalogOrderToUpdate]);

        console.info(
          `Successfully updated order ${order.order_id} (external id: ${order.external_id}, BigBlue id : ${sellerOrderId}) in Catalog`
        );
      } else {
        console.error(
          `Failed to create order ${order.order_id} (external id: ${order.external_id})`
        );
      }
    } catch (error) {
      console.error(
        `Failed to create order ${order.order_id} (external id: ${order.external_id}, BigBlue id : ${sellerOrderId})`,
        error
      );
      throw error;
    }
  }

  private getOrderToCreate(
    order: OrderChangeNotification
  ): BigBlueOrderCreation {
    const noShippingAddressLabel =
      !order.shipping_address.first_name && !order.shipping_address.last_name;

    const orderToCreate: BigBlueOrderCreation = {
      external_id: order.external_id,
      language: "fr",
      shipping_address: {
        first_name: noShippingAddressLabel
          ? order.company_name
          : order.shipping_address.first_name,
        last_name: noShippingAddressLabel
          ? undefined
          : order.shipping_address.last_name,
        line1: order.shipping_address.address_1 ?? "",
        line2: order.shipping_address.address_2,
        postal: order.shipping_address.postal_code,
        city: order.shipping_address.city ?? "",
        country: order.shipping_address.country_code ?? "",
        email: order.email,
      },
      currency: order.currency_code,
      billing_address: {
        company: order.billing_address.label ?? order.company_name,
        line1: order.billing_address.address_1 ?? "",
        line2: order.billing_address.address_2,
        postal: order.billing_address.postal_code,
        city: order.billing_address.city ?? "",
        country: order.billing_address.country_code ?? "",
        email: order.email,
      },
      line_items: this.getOrderLinesToCreate(order.items),
      shipping_price: order.shipping_price.toString(),
      shipping_tax: order.shipping_tax.toString(),
      shipping_method: order.shipping_method,
    };

    return orderToCreate;
  }

  private getOrderLinesToCreate(items: OrderChangeItem[]): BigBlueLineItem[] {
    const lines = new Array<BigBlueLineItem>();
    for (const item of items) {
      const line: BigBlueLineItem = {
        product: item.alternative_sku || item.sku,
        quantity: item.quantity,
        unit_price: item.unit_price.toString(),
        unit_tax: item.unit_tax.toString(),
      };
      lines.push(line);
    }
    return lines;
  }

  async importOrder(orderId: string): Promise<void> {
    try {
      const order = await this.bigblueOrderClient_.getOrder(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      await this.importOrders_([order]);
      console.info(`Successfully imported order ${orderId}`);
    } catch (error) {
      console.error(`Failed to import order ${orderId}`, error);
      throw error;
    }
  }

  async importAllOrders(): Promise<void> {
    const dateFrom = new Date();
    const dateTo = new Date();
    dateFrom.setUTCMonth(dateFrom.getUTCMonth() - 3);
    await this.importOrders(dateFrom, dateTo);
  }

  async updateOrderStatus(
    orderStatusUpdateRequest: BigBlueOrderStatusUpdate
  ): Promise<void> {
    const sellerOrderId = orderStatusUpdateRequest.id;

    try {
      const existingOrder = await this.bigblueOrderClient_.getOrder(
        sellerOrderId
      );

      if (existingOrder) {
        if (!existingOrder.status) {
          existingOrder.status = {
            code: orderStatusUpdateRequest.code,
            message: "",
          };
        } else {
          existingOrder.status.code = orderStatusUpdateRequest.code;
        }

        const orderToUpdate = this.getCatalogOrder(existingOrder);
        await this.orderClient_.updateOrCreateOrders([orderToUpdate]);
      } else {
        console.warn(`order ${sellerOrderId} not found`);
      }
    } catch (error) {
      console.error(`Failed to update status of order ${sellerOrderId}`, error);
    }
  }

  private async importOrders(dateFrom: Date, dateTo: Date): Promise<void> {
    try {
      const ordersPromise = this.bigblueOrderClient_.getOrders(
        dateFrom,
        dateTo
      );

      const orders = await ordersPromise;

      if (orders.length) {
        console.info(
          `Received ${orders.length} orders but only ${orders.length} ones concerning customers`
        );

        // orders with at least one unit price = 0
        const ordersWithNoUnitPrice = orders.filter((o) =>
          o.line_items.some((li) => Number(li.unit_price) === 0)
        );

        const hasOrdersWithNoUnitPrice = ordersWithNoUnitPrice.length > 0;
        const enableOrdersWithNoUnitPrice = true;

        if (hasOrdersWithNoUnitPrice) {
          console.warn(
            `Received ${
              ordersWithNoUnitPrice.length
            } orders with missing unit price ; ${
              enableOrdersWithNoUnitPrice
                ? "importing them anyway"
                : "skipping them"
            }`,
            ordersWithNoUnitPrice
          );
        }

        const ordersToImport =
          !hasOrdersWithNoUnitPrice || enableOrdersWithNoUnitPrice
            ? orders
            : orders.filter((o) =>
                o.line_items.every((li) => Number(li.unit_price) > 0)
              );

        await this.importOrders_(ordersToImport);

        console.info(`Successfully imported ${ordersToImport.length} orders`);
      } else {
        console.warn(
          `Received ${orders.length} orders but no one concerning customers found`
        );
      }
    } catch (error) {
      console.error("Failed to import orders", error);
      throw error;
    }
  }

  private async importOrders_(bigBlueOrders: BigBlueOrder[]): Promise<void> {
    if (bigBlueOrders?.length > 0) {
      const chunks = chunkArray(bigBlueOrders, ORDER_IMPORT_BATCH_SIZE);
      let i = 0;
      for (const chunk of chunks) {
        try {
          console.info(`Importing order batch ${++i}...`);
          const catalogOrders = this.getCatalogOrders(chunk);
          await this.orderClient_.updateOrCreateOrders(catalogOrders);
          console.info(`Successfully imported order batch ${i}`);
        } catch (error) {
          console.error(`Failed to import order batch ${i}`, error);
        }
      }
    } else {
      console.warn("No orders to create or update");
    }
  }

  private getCatalogOrders(bigBlueOrders: BigBlueOrder[]): PostOrderBody[] {
    return bigBlueOrders.map((o) => this.getCatalogOrder(o));
  }

  getCatalogOrder(bigblueOrder: BigBlueOrder): PostOrderBody {
    const shippingAddressNames = [];
    if (bigblueOrder.shipping_address.first_name) {
      shippingAddressNames.push(bigblueOrder.shipping_address.first_name);
    }
    if (bigblueOrder.shipping_address.last_name) {
      shippingAddressNames.push(bigblueOrder.shipping_address.last_name);
    }

    const billingAddressNames = [];
    if (bigblueOrder.billing_address.first_name) {
      billingAddressNames.push(bigblueOrder.billing_address.first_name);
    }
    if (bigblueOrder.billing_address.last_name) {
      billingAddressNames.push(bigblueOrder.billing_address.last_name);
    }

    const order: PostOrderBody = {
      seller_order_id: bigblueOrder.id,
      external_id: bigblueOrder.external_id,
      email: bigblueOrder.billing_address.email?.trim().toLowerCase(),
      items: this.getLineItems(
        bigblueOrder.line_items,
        bigblueOrder.status?.code
      ).filter((line) => line.quantity > 0),
      status: BigBlueOrderService.getOrderStatus(bigblueOrder),
      payment_status: PaymentStatus.NOT_PAID,
      shipping_address: {
        label:
          shippingAddressNames.length > 0
            ? shippingAddressNames.join(" ")
            : undefined,
        address_1: bigblueOrder.shipping_address.line1,
        address_2: bigblueOrder.shipping_address.line2,
        postal_code: bigblueOrder.shipping_address.postal,
        city: bigblueOrder.shipping_address.city,
        country_code: bigblueOrder.shipping_address.country,
      },
      billing_address: {
        label:
          billingAddressNames.length > 0
            ? billingAddressNames.join(" ")
            : undefined,
        address_1: bigblueOrder.billing_address.line1,
        address_2: bigblueOrder.billing_address.line2,
        postal_code: bigblueOrder.billing_address.postal,
        city: bigblueOrder.billing_address.city,
        country_code: bigblueOrder.billing_address.country,
      },
      currency_code: bigblueOrder.currency,
      shipping_method: {
        name: bigblueOrder.shipping_method ?? "",
        price: Number(bigblueOrder.shipping_price),
      },
      creation_date: bigblueOrder.submit_time,
      erp_tracking_name: BIGBLUE_TRACKING_NAME,
      erp_tracking_url: `${BIGBLUE_TRACKING_URL}/${bigblueOrder.id}`,
    };

    return order;
  }

  private getLineItems(
    lines: BigBlueLineItem[],
    status: BigBlueOrderStatusCode
  ): LineItem[] {
    const isShipped =
      status === BigBlueOrderStatusCode.SHIPPED ||
      status === BigBlueOrderStatusCode.HANDED_OVER ||
      status === BigBlueOrderStatusCode.DELIVERED;
    const isFulfilled =
      status === BigBlueOrderStatusCode.IN_PREPARATION || isShipped;

    return lines.map(
      (line): LineItem => ({
        variant_sku: BigBlueProductService.extractSkuFromProductReference(
          this.skuPrefix_,
          line.product
        ),
        quantity: line.quantity,
        unit_price: Number(line.unit_price),
        fulfilled_quantity: isFulfilled ? line.quantity : undefined,
        shipped_quantity: isShipped ? line.quantity : undefined,
      })
    );
  }

  private static getOrderStatus(order: BigBlueOrder): OrderStatus | undefined {
    if (order.status?.code) {
      switch (order.status.code) {
        case BigBlueOrderStatusCode.BACKORDER:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.PENDING:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.IN_PREPARATION:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.HANDED_OVER:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.SHIPPED:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.DELIVERED:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.RETURNED:
          return OrderStatus.COMPLETED;
        case BigBlueOrderStatusCode.CANCELLED:
          return OrderStatus.CANCELED;
        default:
          return OrderStatus.COMPLETED;
      }
    }
    return undefined;
  }
}
