import { ALBResult, APIGatewayEvent } from "aws-lambda";
import { importOrderByRef } from "../order-base";
import { updateBigBlueOrderStatus } from "../bigblue/bigblue";
import { BigBlueOrderService } from "../../services/bigblue/bigblue-order-service";

export const importOrder = async (event: APIGatewayEvent, context: any) => {
  return await importOrderByRef(event, new BigBlueOrderService("", "", ""));
};

export const updateOrderStatus = async (
  event: APIGatewayEvent,
  context: any
): Promise<ALBResult> => {
  return await updateBigBlueOrderStatus(
    event,
    (process.env.RV_BB_WEBHOOK_SECRET as string) || "",
    new BigBlueOrderService("", "", "")
  );
};
