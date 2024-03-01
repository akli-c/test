import { ALBResult, APIGatewayEvent } from "aws-lambda";
import {
  getBigBlueProductInventories,
  getBigBlueSkuMappings,
  updateBigBlueProductInventory,
} from "../bigblue/bigblue";
import { BigBlueProductService } from "../../services/bigblue/bigblue-product-service";

export const updateProductInventory = async (
  event: APIGatewayEvent,
  context: any
): Promise<ALBResult> => {
  return await updateBigBlueProductInventory(
    event,
    (process.env.RV_BB_WEBHOOK_SECRET as string) || "",
    new BigBlueProductService("", "", "")
  );
};

export const getSkuMappings = async (
  event: APIGatewayEvent,
  context: any
): Promise<ALBResult> => {
  return await getBigBlueSkuMappings(
    event,
    new BigBlueProductService("", "", "")
  );
};

export const getProductInventories = async (
  event: APIGatewayEvent,
  context: any
): Promise<ALBResult> => {
  return await getBigBlueProductInventories(
    event,
    new BigBlueProductService("", "", "")
  );
};
