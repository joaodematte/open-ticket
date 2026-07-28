import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@topsun/ui/components/button";

import { TicketsList } from "@/components/dashboard/tickets-list";

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
