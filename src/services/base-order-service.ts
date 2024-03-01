import { OrderChangeNotification } from "../clients/erp-integration-api/types/order-types";

export interface IOrderService {
  importOrder(orderRef: string): Promise<void>;
  updateOrCreateOrder(order: OrderChangeNotification): Promise<void>;
}
