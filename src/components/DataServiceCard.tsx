import { StatusBadge } from "@/components/StatusBadge";
import type { ServiceSearchResult } from "@/lib/services/types";

export function DataServiceCard({ result }: { result: ServiceSearchResult }) {
  const { service, status, products, error } = result;
  return (
    <div className="rounded-[24px] border border-[#e5e5e5] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <a
          href={service.homepage}
          target="_blank"
          rel="noreferrer"
          className="font-semibold hover:text-[#c97d35]"
        >
          {service.name}
        </a>
        <StatusBadge status={status} />
      </div>

      {status === "ok" && (
        <ul className="flex flex-col gap-2">
          {products.map((p) => (
            <li key={p.sku ?? p.url} className="flex items-center gap-3 text-sm">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#c97d35] hover:underline"
                >
                  {p.name}
                </a>
              </div>
              <div className="text-right whitespace-nowrap">
                {p.priceDisplay && <div>{p.priceDisplay}</div>}
                {p.inStock === false && (
                  <div className="text-xs text-[#c0392b]">Out of stock</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {status === "empty" && (
        <p className="text-sm text-muted">No products matched this search.</p>
      )}

      {(status === "error" || status === "unavailable") && (
        <p className="text-sm text-muted">
          {error ?? "This source could not be reached right now."}
        </p>
      )}

      <p className="text-xs text-muted mt-auto">
        {service.deliveryArea} · {service.deliveryFee}
      </p>
    </div>
  );
}
