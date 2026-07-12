import type { ServiceSearchResult } from "@/lib/services/types";

export function LinkOutServiceCard({ result }: { result: ServiceSearchResult }) {
  const { service, linkOutUrl } = result;
  return (
    <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-zinc-800/60 p-4 flex flex-col gap-3">
      <div className="font-semibold">{service.name}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {service.deliveryArea} · {service.deliveryFee}
      </p>
      <a
        href={linkOutUrl ?? service.homepage}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-block rounded bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-3 py-1.5 text-center hover:bg-gray-700 dark:hover:bg-gray-300"
      >
        Check pricing directly →
      </a>
    </div>
  );
}
