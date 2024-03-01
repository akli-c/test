import { BigBlueProductClient } from "../../clients/bigblue/clients/bigblue-product-client";
import { ErpProductClient } from "../../clients/erp-integration-api/clients/products";
import { ProductVariant } from "../../clients/erp-integration-api/types/product-types";

export class BigBlueProductService {
  private readonly bigblueProductClient_: BigBlueProductClient;
  private readonly productClient_: ErpProductClient;
  private readonly skuPrefix_: string;

  constructor(
    bigBlueBearer: string,
    integrationApiKey: string,
    skuPrefix: string
  ) {
    this.bigblueProductClient_ = new BigBlueProductClient(bigBlueBearer);
    this.productClient_ = new ErpProductClient(integrationApiKey);
    this.skuPrefix_ = skuPrefix;
  }

  updateVariantStocks(stocks: { [productRef: string]: number }): Promise<void> {
    const variantToUpdates: ProductVariant[] = Object.entries(stocks).map(
      ([productRef, stock]) => ({
        sku: BigBlueProductService.extractSkuFromProductReference(
          this.skuPrefix_,
          productRef
        ),
        stock_level: stock,
      })
    );

    console.info("Updating variant stocks...", variantToUpdates);
    return this.productClient_.updateVariants(variantToUpdates);
  }

  static extractSkuFromProductReference(
    prefix: string,
    productReference: string
  ): string {
    const regex = new RegExp(`${prefix}-(\\d+)-`);
    const match = productReference.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    console.warn(
      "no sku extracted in product reference, use complete reference" +
        productReference
    );
    return productReference;
  }

  async getSkuMappings(): Promise<{ [sku: string]: string }> {
    const products = await this.bigblueProductClient_.getProducts();
    const skuMappings = Object.fromEntries(
      products.map((p) => [
        BigBlueProductService.extractSkuFromProductReference(
          this.skuPrefix_,
          p.id
        ),
        p.id,
      ])
    );

    return skuMappings;
  }

  async getProductInventories(): Promise<{ [sku: string]: number }> {
    const inventoryList = await this.bigblueProductClient_.getInventories();
    const inventories = Object.fromEntries(
      inventoryList.map((p) => [
        BigBlueProductService.extractSkuFromProductReference(
          this.skuPrefix_,
          p.product
        ),
        p.available ?? 0,
      ])
    );

    return inventories;
  }
}
