import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { cn } from "@topsun/ui/lib/utils";

import {
  priorityIcons,
  priorityLabels,
  statusIcons,
  statusLabels,
} from "@/utils/ticket";

type Ticket = RouterOutputs["ticket"]["getByUser"][number];

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <Link
        to="/ticket/$ticketId"
        params={{
          ticketId: row.original.id,
        }}
        className="font-medium hover:underline"
      >
        {row.original.title}
      </Link>
    ),
    header: "Título",
  },
  {
    accessorKey: "priority",
    cell: ({ row }) => {
      const { icon: Icon, iconClassName } =
        priorityIcons[row.original.priority];

      return (
        <span className="flex items-center gap-2 font-medium">
          <Icon className={cn("size-4", iconClassName)} />
          {priorityLabels[row.original.priority]}
        </span>
      );
    },
    header: "Prioridade",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const { icon: StatusIcon, iconClassName } =
        statusIcons[row.original.status];

      return (
        <span className="flex items-center gap-2 font-medium">
          <StatusIcon className={cn("size-4", iconClassName)} />
          {statusLabels[row.original.status]}
        </span>
      );
    },
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
    header: "Criado em",
  },
];
