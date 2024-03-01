export interface PostCatalogsBody {
  /**
   * companies to update or create
   */
  catalogs: Catalog[];
}

export interface Catalog {
  /**
   * name of the catalog
   */
  name: string;

  /**
   * list of variants with their price(s)
   */
  variants: Variant[];

  /**
   * list of variants to delete ; optional
   */
  variants_to_delete?: VariantToDelete[];

  /**
   * if true, just add/remove variants, do not erase existing prices
   */
  partial_update?: boolean;
}

export interface Variant {
  /**
   * variant sku
   */
  sku: string;

  /**
   * variant net price
   */
  net_price: number;

  /**
   * currency
   */
  currency_code: string;

  /**
   * true if tier pricing defined
   */
  tier_pricing_enabled?: boolean;

  /**
   * tier pricings
   * read only if tier_pricing_enabled is true
   */
  tier_pricings?: TierPricing[];
}

export interface VariantToDelete {
  /**
   * variant sku
   */
  sku: string;
}

export interface TierPricing {
  /**
   * min quantity
   */
  min_quantity: number;

  /**
   * tier price
   */
  price: number;
}
