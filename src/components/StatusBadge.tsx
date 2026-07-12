import type { ServiceStatus } from "@/lib/services/types";

const STYLES: Record<ServiceStatus, { label: string; className: string }> = {
  ok: {
    label: "Results found",
    className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  empty: {
    label: "No matches",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300",
  },
  error: {
    label: "Error",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  unavailable: {
    label: "Temporarily unavailable",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const { label, className } = STYLES[status];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
