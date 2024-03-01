import { ALBResult, APIGatewayEvent } from "aws-lambda";
import { IOrderService } from "../services/base-order-service";
import { JsonHttpResult } from "../utils/json-http-result";
import { OrderChangeNotification } from "../clients/erp-integration-api/types/order-types";

export const importOrderByRef = async (
  event: APIGatewayEvent,
  orderService: IOrderService
): Promise<ALBResult> => {
  try {
    if (!event.pathParameters?.ref) {
      console.error("Bad request - missing path parameters");
      return JsonHttpResult.badRequest(
        JSON.stringify({ message: "Bad request - missing path parameters" })
      );
    }

    const orderRef = event.pathParameters.ref;

    await orderService.importOrder(orderRef);

    return JsonHttpResult.noContent();
  } catch (error) {
    console.error("Error in importOrder:", error);

    const notFoundError = error as Error;

    if (notFoundError.name === "OrderNotFound") {
      return JsonHttpResult.notFound(
        JSON.stringify({ message: notFoundError.message })
      );
    }

    return JsonHttpResult.internalError(JSON.stringify(error));
  }
};

export const updateOrCreateOrder = async (
  event: APIGatewayEvent,
  orderService: IOrderService
): Promise<ALBResult> => {
  try {
    if (!event.body) {
      console.error("Bad request - missing request body");
      return JsonHttpResult.badRequest(
        JSON.stringify({ message: "Bad request - missing request body" })
      );
    }

    const orderBody = JSON.parse(event.body) as OrderChangeNotification;

    if (orderBody == null) {
      console.warn("no order to import");
      return JsonHttpResult.badRequest("no order to create");
    }

    console.info("trying to create or update order in ERP...", orderBody);

    await orderService.updateOrCreateOrder(orderBody);

    console.info("Successfully created or updated order in ERP");

    return JsonHttpResult.noContent();
  } catch (err) {
    console.error("Failed to create order", err);
    return JsonHttpResult.internalError(JSON.stringify(err));
  }
};
