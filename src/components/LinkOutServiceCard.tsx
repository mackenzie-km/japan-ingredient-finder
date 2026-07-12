import type { ServiceSearchResult } from "@/lib/services/types";

export function LinkOutServiceCard({ result }: { result: ServiceSearchResult }) {
  const { service, linkOutUrl } = result;
  return (
    <div className="rounded-[24px] border border-dashed border-[#d68c45]/50 bg-[#f4d6b0]/30 shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-3">
      <div className="font-semibold">{service.name}</div>
      <p className="text-xs text-muted">
        {service.deliveryArea} · {service.deliveryFee}
      </p>
      <a
        href={linkOutUrl ?? service.homepage}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-block text-center rounded-full bg-gradient-to-r from-[#c97d35] to-[#d68c45] text-white font-semibold text-sm px-4 py-2 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(214,140,69,0.3)]"
      >
        Check pricing directly →
      </a>
    </div>
  );
}
