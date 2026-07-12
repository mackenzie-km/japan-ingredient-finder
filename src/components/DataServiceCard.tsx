import { StatusBadge } from "@/components/StatusBadge";
import type { ServiceSearchResult } from "@/lib/services/types";

export function DataServiceCard({ result }: { result: ServiceSearchResult }) {
  const { service, status, products, error } = result;
  return (
    <div className="rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-white dark:bg-[#2a2118] shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <a
          href={service.homepage}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-zinc-900 dark:text-zinc-50 hover:text-amber-700 dark:hover:text-amber-400"
        >
          {service.name}
        </a>
        <StatusBadge status={status} />
      </div>

      {status === "ok" && (
        <ul className="flex flex-col gap-2">
          {products.map((p) => (
            <li key={p.url} className="flex items-center gap-3 text-sm">
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
              )}
              <div className="flex-1 min-w-0 text-zinc-800 dark:text-zinc-200">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-700 dark:hover:text-amber-400 hover:underline"
                >
                  {p.name}
                </a>
              </div>
              <div className="text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                {p.priceDisplay && <div>{p.priceDisplay}</div>}
                {p.inStock === false && (
                  <div className="text-xs text-red-600 dark:text-red-400">Out of stock</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {status === "empty" && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No products matched this search.</p>
      )}

      {(status === "error" || status === "unavailable") && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error ?? "This source could not be reached right now."}
        </p>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">
        {service.deliveryArea} · {service.deliveryFee}
      </p>
    </div>
  );
}
