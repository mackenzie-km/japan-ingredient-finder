export type ServiceId =
  | "meatguy"
  | "halalfoodjp"
  | "tengunaturalfoods"
  | "nationalazabu"
  | "kaldi"
  | "asiasuperstore"
  | "iherb"
  | "amazonfresh"
  | "amazonjp"
  | "ubereats";

export type ServiceKind = "data" | "link-out";
export type ServiceStatus = "ok" | "empty" | "error" | "unavailable";

export interface ServiceMeta {
  id: ServiceId;
  name: string;
  kind: ServiceKind;
  homepage: string;
  deliveryArea: string;
  deliveryFee: string;
}

export interface ProductResult {
  name: string;
  priceYen: number | null;
  priceDisplay: string | null;
  url: string;
  imageUrl?: string;
  inStock: boolean | null;
  sku?: string;
  tags?: string[];
}

export interface ServiceSearchResult {
  service: ServiceMeta;
  status: ServiceStatus;
  query: string;
  products: ProductResult[];
  linkOutUrl?: string;
  error?: string;
  fetchedAt: string;
  durationMs: number;
}

// search() must never throw. Every adapter wraps its own fetch/parse logic in
// try/catch and always resolves a ServiceSearchResult (status "error"/"unavailable"
// on failure), still carrying `service` so the UI can always render a card.
// Promise.allSettled at the aggregation layer is a second, defensive layer,
// not the primary error-handling path.
export interface ServiceAdapter {
  meta: ServiceMeta;
  search(query: string): Promise<ServiceSearchResult>;
}

export interface SearchApiResponse {
  query: string;
  tookMs: number;
  results: ServiceSearchResult[];
}
