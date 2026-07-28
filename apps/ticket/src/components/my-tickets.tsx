import { IconMoodPuzzled, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { Button } from "@topsun/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";

import {
  priorityIcons,
  priorityLabels,
  statusIcons,
  statusLabels,
} from "@/utils/ticket";
import { useTRPC } from "@/utils/trpc";

import { DataTable } from "./data-table";

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

function TicketsList() {
  const trpc = useTRPC();
  const { data: tickets, isLoading: isTicketsLoading } = useQuery(
    trpc.ticket.getByUser.queryOptions()
  );

  if (isTicketsLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  if (tickets?.length === 0 || !tickets) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-xl border border-dashed">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconMoodPuzzled />
            </EmptyMedia>
            <EmptyTitle>Nenhum ticket encontrado</EmptyTitle>
            <EmptyDescription>
              Você ainda não tem nenhum ticket aberto
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-72 w-full rounded-xl border">
      <DataTable className="size-full" columns={columns} data={tickets} />
    </div>
  );
}

export function MyTickets() {
  return (
    <section className="mt-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Meus tickets</h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe todos os tickets solicitados por você
          </p>
        </div>

        <Button
          nativeButton={false}
          size="lg"
          render={<Link to="/ticket/create" />}
        >
          <IconPlus className="size-4" />
          Novo ticket
        </Button>
      </div>

      <TicketsList />
    </section>
  );
}
