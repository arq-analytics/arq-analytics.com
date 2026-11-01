import type { Status } from "@/lib/types";

const tones: Record<Status, "healthy" | "warning" | "neutral"> = {
  live: "healthy",
  earlyAccess: "warning",
  inDevelopment: "warning",
  planned: "neutral",
};

/** Status is always a pill plus a text label, never colour alone. */
export function StatusPill({ status, label }: { status: Status; label: string }) {
  return (
    <span className="arq-status" data-tone={tones[status]}>
      {label}
    </span>
  );
}
