export interface BigBlueInventoryUpdateBody {
  update_time: string;
  inventories: BigBlueInventoryUpdate[];
}

export interface BigBlueInventoryUpdate {
  warehouse: string;
  product: string;
  product_name: string;
  barcode?: string;
  available: number;
  reserved: number;
  damaged: number;
  backordered: number;
}

export interface BigBlueProduct {
  id: string;
}

export interface BigBlueListProductsResponse {
  products: BigBlueProduct[];
  next_page_token: string;
}

export interface BigBlueInventories {
  product: string;
  warehouse: string;
  available?: number;
  in_warehouse?: number;
}
export interface BigBlueListInventoriesResponse {
  inventories: BigBlueInventories[];
  next_page_token: string;
}
