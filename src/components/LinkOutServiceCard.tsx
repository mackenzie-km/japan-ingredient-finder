import type { ServiceSearchResult } from "@/lib/services/types";

export function LinkOutServiceCard({ result }: { result: ServiceSearchResult }) {
  const { service, linkOutUrl } = result;
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 shadow-sm p-4 flex flex-col gap-3">
      <div className="font-semibold text-zinc-900">{service.name}</div>
      <p className="text-xs text-gray-500">
        {service.deliveryArea} · {service.deliveryFee}
      </p>
      <a
        href={linkOutUrl ?? service.homepage}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-block rounded-full bg-amber-700 text-white text-sm px-4 py-1.5 text-center hover:bg-amber-800 transition-colors"
      >
        Check pricing directly →
      </a>
    </div>
  );
}
