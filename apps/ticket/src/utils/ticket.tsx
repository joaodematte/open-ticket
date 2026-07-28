import type { Icon } from "@tabler/icons-react";
import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconCircleFilled,
  IconCircleXFilled,
  IconTriangleInvertedFilled,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

export const typeOptions = [
  { label: "Bug", value: "bug" },
  { label: "Nova funcionalidade", value: "feature" },
  { label: "Tarefa", value: "task" },
  { label: "Melhoria", value: "improvement" },
  { label: "Documentação", value: "documentation" },
  { label: "Outros", value: "other" },
];

export const priorityOptions = [
  {
    label: "Baixa",
    value: "low",
  },
  {
    label: "Média",
    value: "medium",
  },
  {
    label: "Alta",
    value: "high",
  },
  {
    label: "Crítica",
    value: "critical",
  },
];

export const statusOptions = [
  { label: "Aberto", value: "open" },
  { label: "Em andamento", value: "in_progress" },
  { label: "Fechado", value: "closed" },
  { label: "Cancelado", value: "cancelled" },
];

export const priorityIcons: Record<
  string,
  { icon: Icon; iconClassName: string }
> = {
  critical: {
    icon: IconAlertCircleFilled,
    iconClassName: "text-red-500 group-focus/select-item:text-red-600",
  },
  high: {
    icon: IconAlertTriangleFilled,
    iconClassName: "text-yellow-500 group-focus/select-item:text-yellow-600",
  },
  low: {
    icon: IconTriangleInvertedFilled,
    iconClassName: "text-green-500 group-focus/select-item:text-green-600",
  },
  medium: {
    icon: IconCircleFilled,
    iconClassName: "text-blue-500 group-focus/select-item:text-blue-600",
  },
};

export const priorityLabels: Record<string, string> = {
  critical: "Crítico",
  high: "Alta",
  low: "Baixa",
  medium: "Média",
};

export const typeLabels: Record<string, string> = {
  bug: "Bug",
  documentation: "Documentação",
  feature: "Feature",
  improvement: "Melhoria",
  other: "Outro",
  task: "Tarefa",
};

export const statusLabels: Record<string, string> = {
  cancelled: "Cancelado",
  closed: "Fechado",
  in_progress: "Em andamento",
  open: "Aberto",
};

interface StatusIconProps {
  className?: string;
}

const PIE_RADIUS = 4;
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;

/** Ring with an inner pie slice filled up to `progress` (0 to 1). */
function ProgressCircle({
  className,
  progress,
}: StatusIconProps & { progress: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <circle
        cx="12"
        cy="12"
        r={PIE_RADIUS}
        strokeWidth={PIE_RADIUS * 2}
        strokeDasharray={`${PIE_CIRCUMFERENCE * progress} ${PIE_CIRCUMFERENCE}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

const OpenIcon = ({ className }: StatusIconProps) => (
  <ProgressCircle className={className} progress={0} />
);

const InProgressIcon = ({ className }: StatusIconProps) => (
  <ProgressCircle className={className} progress={0.5} />
);

export const statusIcons: Record<
  string,
  { icon: ComponentType<StatusIconProps>; iconClassName: string }
> = {
  cancelled: {
    icon: IconCircleXFilled,
    iconClassName: "text-muted-foreground",
  },
  closed: {
    icon: IconCircleCheckFilled,
    iconClassName: "text-primary",
  },
  in_progress: {
    icon: InProgressIcon,
    iconClassName: "text-amber-500",
  },
  open: {
    icon: OpenIcon,
    iconClassName: "text-muted-foreground",
  },
};
