import { IconMoodPuzzled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { columns } from "@/components/dashboard/my-tickets-columns";
import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/utils/trpc";

export function TicketsList() {
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
