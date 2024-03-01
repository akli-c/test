import { Metadata } from "./base-types";

export interface PostProductsBody {
  /**
   * products to update or create
   */
  products: Product[];
}

export interface Product {
  /**
   * product handle (should be unique)
   */
  handle: string;

  /**
   * product name
   */
  name: string;

  /**
   * product description
   */
  description?: string;

  /**
   * list of tags ; not used for the moment
   */
  tags?: string[];

  /**
   * @deprecated : use category_handles instead
   * category hierarchies of the product
   * if some are defined they are taken in the order of the array tot define the category hierarchy
   * first element : top category
   * second element : sub category
   * third element : sub sub category
   * ...
   */
  category_hierarchies?: string[][];

  /**
   * The handles of the categories the product belongs to.
   */
  category_handles?: string[];

  /**
   * product status
   * value should be in ["draft", "proposed", "published", "rejected"]
   */
  status: ProductStatus;

  /**
   * product type
   * used for tax calculation
   */
  type?: string;

  /**
   * product option names and types : if defined, variants should contain all of them
   */
  product_options?: ProductOption[];

  /**
   * product files : technical documentation, user manual, marketing sheet, ...
   */
  files?: File[];

  /**
   * product variants ; should contain at least one variant
   */
  variants: ProductVariant[];

  /**
   * if true, delete variants not present in the variants array
   */
  delete_other_variants: boolean;

  /**
   * metadata
   */
  metadata?: Metadata[];
}

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

/**
 * product file
 */
export interface File {
  /**
   * file name
   */
  name: string;

  /**
   * file url
   */
  url: string;
}

export interface ProductVariant {
  /**
   * variant name ; if not defined it is set to the product name
   */
  name?: string;

  /**
   * sku, should be unique
   */
  sku: string;

  /**
   * alternative sku, should be unique
   */
  alternative_sku?: string;

  /**
   * ean, if defined, should be unique
   */
  ean?: string;

  /**
   * options of the variant ; if defined should correpond to the product options
   */
  options?: VariantOption[];

  /**
   * characteristics of the variant
   */
  characteristics?: Characteristic[];

  /**
   * width of the variant (in m)
   */
  width?: number;

  /**
   * length of the variant (in m)
   */
  length?: number;

  /**
   * height of the variant (in m)
   */
  height?: number;

  /**
   * weight of the variant (in kg)
   */
  weight?: number;

  /**
   * The material composition of the variant.
   */
  material?: string;

  /**
   * retail sale price of the variant.
   */
  rsp_per_unit?: number;

  /**
   * pcb
   * if not defined it is set to 1
   */
  pcb?: number;

  /**
   * minimum order quantity
   * if not defined it is set to 1
   */
  moq?: number;

  /**
   * stock level
   */
  stock_level?: number;

  /**
   *
   * images of the variant. The first image is the main image (thumbnail)
   * order in the array is keep to display the images in the same order
   */
  images?: string[];

  /**
   * different shipping delays
   */
  delays?: Delay[];

  /**
   * maintenance code
   */
  maintenance_code?: string;

  /**
   * origin country
   */
  origin_country?: string;

  /**
   * variant files : technical documentation, user manual, marketing sheet, ...
   */
  files?: File[];

  /**
   * metadata
   */
  metadata?: Metadata[];

  /**
   * Used to sort the search results
   */
  priority?: number;

  /**
   * Is pre-order
   */
  is_preorder?: boolean;
}

export interface ProductOption {
  /**
   * option name
   */
  name: string;

  /**
   * option type
   */
  type?: OptionType;
}

export interface VariantOption {
  /**
   * option name: should be one of the product option names
   */
  name: string;

  /**
   * option value
   */
  value: string;

  /**
   * group of the value
   */
  value_group?: string;

  /**
   * option type
   * only for processing, not send to the API
   */
  type?: OptionType;
}

export interface Characteristic {
  /**
   * characteristic name
   */
  name: string;

  /**
   * characteristic value
   */
  value: string;
}

export interface Delay {
  /**
   * delay name
   */
  name: string;

  /**
   * delay value
   */
  value: string;
}

export interface ProductVariantUpdate {
  /**
   * variant name
   */
  name?: string;

  /**
   * ean, if defined, should be unique
   */
  ean?: string;

  /**
   * options of the variant ; if defined should correpond to the product options
   */
  options?: VariantOption[];

  /**
   * characteristics of the variant
   */
  characteristics?: Characteristic[];

  /**
   * width of the variant (in m)
   */
  width?: number;

  /**
   * length of the variant (in m)
   */
  length?: number;

  /**
   * height of the variant (in m)
   */
  height?: number;

  /**
   * weight of the variant (in kg)
   */
  weight?: number;

  /**
   * The material composition of the variant.
   */
  material?: string;

  /**
   * retail sale price of the variant.
   * if not defined it is set to 0
   */
  rsp_per_unit?: number;

  /**
   * pcb
   * if not defined it is set to 1
   */
  pcb?: number;

  /**
   * minimum order quantity
   * if not defined it is set to 1
   */
  moq?: number;

  /**
   * stock level
   */
  stock_level?: number;

  /**
   *
   * images of the variant. The first image is the main image (thumbnail)
   * order in the array is keep to display the images in the same order
   */
  images?: string[];

  /**
   * different shipping delays
   */
  delays?: Delay[];

  /**
   * maintenance code
   */
  maintenance_code?: string;

  /**
   * origin country
   */
  origin_country?: string;

  /**
   * variant files : technical documentation, user manual, marketing sheet, ...
   */
  files?: File[];

  /**
   * metadata
   */
  metadata?: Metadata[];
}

export enum OptionType {
  ANGLE = "angle",
  AREA = "area",
  DATA = "data",
  ENERGY = "energy",
  FORCE = "force",
  LENGTH = "length",
  MASS = "mass",
  POWER = "power",
  PRESSURE = "pressure",
  TEMPERATURE = "temperature",
  TIME = "time",
  VOLUME = "volume",
  NUMBER = "number",
  COLOR = "color",
}

export interface ProductVariantExternalSku {
  /**
   * company code
   */
  company_code: string;

  /**
   * sku
   */

  external_sku: string;

  /**
   * variant sku
   */
  sku: string;
}
