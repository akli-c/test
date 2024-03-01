import { BigBlueOrderService } from "../../services/bigblue/bigblue-order-service";

export const importAllOrders = async (event: any, context: any) => {
  try {
    const orderService = new BigBlueOrderService("", "", "");

    await orderService.importAllOrders();
  } catch (error) {
    console.error("Error in importAllOrders", error);
  }
};
