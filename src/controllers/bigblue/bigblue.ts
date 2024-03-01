import { ALBResult, APIGatewayEvent } from "aws-lambda";
import {
  BIGBLUE_EVENT_SIGNATURE_HEADER,
  BIGBLUE_EVENT_TYPE_HEADER,
  BIGBLUE_EVENT_URL_VERIFICATION,
} from "../../constants";
import { JsonHttpResult } from "../../utils/json-http-result";
import crypto from "crypto";
import { BigBlueOrderService } from "../../services/bigblue/bigblue-order-service";
import { BigBlueOrderStatusUpdateBody } from "../../clients/bigblue/types/bigblue-order-types";
import { BigBlueInventoryUpdateBody } from "../../clients/bigblue/types/bigblue-product-types";
import { BigBlueVerificationBody } from "../../clients/bigblue/types/bigblue-types";
import { BigBlueProductService } from "../../services/bigblue/bigblue-product-service";

const checkBigBlueWebhookSignature = (
  event: APIGatewayEvent,
  webhookSecret: string
): ALBResult | undefined => {
  const hmac = event.headers[BIGBLUE_EVENT_SIGNATURE_HEADER] as
    | string
    | undefined;
  if (!hmac) {
    console.error("checkBigBlueWebhookSignature - hmac not found in header");
    return JsonHttpResult.unauthorized(
      "Unauthorized: hmac not found in header"
    );
  }

  if (!event.body) {
    console.error("checkBigBlueWebhookSignature: - event.body is undefined.");
    return JsonHttpResult.badRequest("body is undefined");
  }

  const hash = crypto
    .createHmac("sha256", webhookSecret)
    .update(event.body)
    .digest("base64");

  const signatureOk = crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmac)
  );

  if (!signatureOk) {
    console.error("checkBigBlueWebhookSignature - signature mismatch.");
    return JsonHttpResult.unauthorized(
      "checkBigBlueWebhookSignature - signature mismatch."
    );
  }

  return undefined;
};

const checkBigBlueWebhookChallenge = (
  event: APIGatewayEvent
): ALBResult | undefined => {
  if (!event.body) {
    console.error("checkBigBlueWebhookChallenge: event.body is undefined.");
    return JsonHttpResult.badRequest(
      "checkBigBlueWebhookChallenge - body is undefined"
    );
  }

  if (
    event.headers[BIGBLUE_EVENT_TYPE_HEADER] === BIGBLUE_EVENT_URL_VERIFICATION
  ) {
    const verificationBody = JSON.parse(event.body) as BigBlueVerificationBody;
    const responseBody = {
      challenge: verificationBody.challenge,
    };

    return JsonHttpResult.ok(JSON.stringify(responseBody));
  }

  return undefined;
};
export const updateBigBlueOrderStatus = async (
  event: APIGatewayEvent,
  webhookSecret: string,
  orderService: BigBlueOrderService
): Promise<ALBResult> => {
  try {
    console.info("updateBigBlueOrderStatus called!");

    // first check signature
    const signatureError = checkBigBlueWebhookSignature(event, webhookSecret);
    if (signatureError) {
      return signatureError;
    }

    if (!event.body) {
      console.error("updateBigBlueOrderStatus: event.body is undefined.");
      return JsonHttpResult.badRequest(
        "updateBigBlueOrderStatus - body is undefined"
      );
    }

    const challengeResponse = checkBigBlueWebhookChallenge(event);
    if (challengeResponse) {
      return challengeResponse;
    }

    const orderUpdateStatusBody = JSON.parse(
      event.body
    ) as BigBlueOrderStatusUpdateBody;

    console.info(
      "updateBigBlueOrderStatus: orderUpdateStatusBody",
      orderUpdateStatusBody
    );

    await orderService.updateOrderStatus(orderUpdateStatusBody.order_status);

    console.info("Successfully processed order status update");

    return JsonHttpResult.ok("{}");
  } catch (error) {
    console.error("Error in updateBigBlueOrderStatus:", error);
    return JsonHttpResult.internalError(JSON.stringify(error));
  }
};

export const updateBigBlueProductInventory = async (
  event: APIGatewayEvent,
  webhookSecret: string,
  productService: BigBlueProductService
): Promise<ALBResult> => {
  try {
    console.info("updateBigBlueProductInventory called!");

    // first check signature
    const signatureError = checkBigBlueWebhookSignature(event, webhookSecret);
    if (signatureError) {
      return signatureError;
    }

    if (!event.body) {
      console.error("updateBigBlueProductInventory: event.body is undefined.");
      return JsonHttpResult.badRequest(
        "updateBigBlueProductInventory - body is undefined"
      );
    }

    const challengeResponse = checkBigBlueWebhookChallenge(event);
    if (challengeResponse) {
      return challengeResponse;
    }

    const orderUpdateStatusBody = JSON.parse(
      event.body
    ) as BigBlueInventoryUpdateBody;

    console.info(
      "Trying to process inventory update...",
      orderUpdateStatusBody
    );

    const stockUpdates = orderUpdateStatusBody.inventories.reduce(
      (stock, inventory) => {
        stock[inventory.product] = inventory.available;
        return stock;
      },
      {} as { [productRef: string]: number }
    );

    await productService.updateVariantStocks(stockUpdates);

    console.info("Successfully processed inventory update");

    return JsonHttpResult.ok("{}");
  } catch (error) {
    console.error("Error in updateBigBlueProductInventory:", error);
    return JsonHttpResult.internalError(JSON.stringify(error));
  }
};

export const getBigBlueSkuMappings = async (
  event: APIGatewayEvent,
  productService: BigBlueProductService
) => {
  try {
    const skuMappings = await productService.getSkuMappings();

    return JsonHttpResult.ok(JSON.stringify({ sku_mappings: skuMappings }));
  } catch (error) {
    console.error("Error in getSkuMappings:", error);

    return JsonHttpResult.internalError(
      JSON.stringify({ error: (error as any).message })
    );
  }
};

export const getBigBlueProductInventories = async (
  event: APIGatewayEvent,
  productService: BigBlueProductService
) => {
  try {
    const inventories = await productService.getProductInventories();

    return JsonHttpResult.ok(JSON.stringify({ inventories: inventories }));
  } catch (error) {
    console.error("Error in getBigBlueProductInventories:", error);

    return JsonHttpResult.internalError(
      JSON.stringify({ error: (error as any).message })
    );
  }
};
