import type { ServiceStatus } from "@/lib/services/types";

const STYLES: Record<ServiceStatus, { label: string; className: string }> = {
  ok: { label: "Results found", className: "bg-[#eaf5ec] text-[#2a7a3b]" },
  empty: { label: "No matches", className: "bg-[#f0ebe6] text-muted-strong" },
  error: { label: "Error", className: "bg-[#fce8e6] text-[#c0392b]" },
  unavailable: { label: "Temporarily unavailable", className: "bg-[#f4d6b0] text-[#c97d35]" },
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`inline-block shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
