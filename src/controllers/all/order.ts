import { updateOrCreateOrder } from "../order-base";
import { JsonHttpResult } from "../../utils/json-http-result";
import { ALBResult, APIGatewayEvent } from "aws-lambda";
import { BigBlueOrderService } from "../../services/bigblue/bigblue-order-service";

export const postOrder = async (
  event: APIGatewayEvent,
  context: any
): Promise<ALBResult> => {
  const sellerName = process.env.SELLER_NAME as string;
  try {
    const orderService = new BigBlueOrderService("", "", "");

    return await updateOrCreateOrder(event, orderService);
  } catch (error) {
    console.error(`Failed to post order for ${sellerName}`, error);
    return JsonHttpResult.internalError(JSON.stringify({ error: error }));
  }
};
