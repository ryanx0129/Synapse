import { AlertCircle, CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import type { ConceptStatus } from "@/domain/graph/graphSchema";

const metadata = {
  gap: { label: "Gap", Icon: AlertCircle },
  review: { label: "Review", Icon: Clock3 },
  mastered: { label: "Mastered", Icon: CheckCircle2 },
  locked: { label: "Locked", Icon: LockKeyhole },
} as const;

export function StatusBadge({ status, compact = false }: { status: ConceptStatus; compact?: boolean }) {
  const { Icon, label } = metadata[status];
  return (
    <span className={`status-badge status-${status}`} aria-label={`Knowledge status: ${label}`}>
      <Icon size={compact ? 13 : 15} aria-hidden="true" />
      {!compact && <span>{label}</span>}
    </span>
  );
}

