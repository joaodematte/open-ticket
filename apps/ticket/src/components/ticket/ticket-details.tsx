import { IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { Button } from "@topsun/ui/components/button";
import { Separator } from "@topsun/ui/components/separator";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { cn } from "@topsun/ui/lib/utils";

import { authClient } from "@/lib/auth-client";
import { useUpdateDialogStore } from "@/stores/update-dialog";
import {
  priorityIcons,
  priorityLabels,
  statusIcons,
  statusLabels,
  typeLabels,
} from "@/utils/ticket";
import { useTRPC } from "@/utils/trpc";

type Ticket = RouterOutputs["ticket"]["getById"];

const ticketRouteApi = getRouteApi("/_protected/ticket/$ticketId");

function TicketBody({ ticket }: { ticket: Ticket }) {
  return (
    <div className="col-span-4 space-y-2">
      <h1 className="text-xl font-medium">{ticket.title}</h1>
      <p className="text-muted-foreground text-sm">{ticket.description}</p>
    </div>
  );
}

function TicketActions({ ticket }: { ticket: Ticket }) {
  const { toggle } = useUpdateDialogStore();
  const { data: session } = authClient.useSession();

  const { icon: StatusIcon, iconClassName: statusIconClassName } =
    statusIcons[ticket.status];
  const { icon: PriorityIcon, iconClassName: priorityIconClassName } =
    priorityIcons[ticket.priority];

  return (
    <div className="bg-muted col-span-2 space-y-4 rounded-2xl p-4">
      <div>
        <span className="font-medium">Status</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <StatusIcon className={cn("size-3.5", statusIconClassName)} />
          {statusLabels[ticket.status]}
        </span>
      </div>
      <div>
        <span className="font-medium">Prioridade</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <PriorityIcon className={cn("size-3.5", priorityIconClassName)} />
          {priorityLabels[ticket.priority]}
        </span>
      </div>
      <div>
        <span className="font-medium">Tipo</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {typeLabels[ticket.type]}
        </span>
      </div>
      <div>
        <span className="font-medium">Criado por</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.user?.name ?? "—"}
        </span>
      </div>
      <div>
        <span className="font-medium">Criado em</span>
        <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
          {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <div>
        <span className="font-medium">Atualizado em</span>
        <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
          {new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <Separator />
      <div>
        <span className="font-medium">Horas estimadas</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.estimatedTime ?? "—"}
        </span>
      </div>
      <div>
        <span className="font-medium">Responsável</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.assignee?.name ?? "—"}
        </span>
      </div>
      {session?.user.role?.toLowerCase() === "admin" && (
        <Button className="w-full" onClick={() => toggle(ticket)}>
          <IconEdit />
          Atualizar ticket
        </Button>
      )}
    </div>
  );
}

export function TicketDetails() {
  const { ticketId } = ticketRouteApi.useParams();
  const trpc = useTRPC();

  const { data: ticket, isLoading } = useQuery(
    trpc.ticket.getById.queryOptions({
      id: ticketId,
    })
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-4 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-72 w-full" />
        </div>
        <Skeleton className="col-span-2 h-128.25" />
      </div>
    );
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-6">
      <TicketBody ticket={ticket} />
      <TicketActions ticket={ticket} />
    </div>
  );
}
