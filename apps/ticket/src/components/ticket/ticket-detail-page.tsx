import { Separator } from "@topsun/ui/components/separator";

import { BackLink } from "@/components/ticket/back-link";
import { TicketComments } from "@/components/ticket/ticket-comments";
import { TicketDetails } from "@/components/ticket/ticket-details";
import { UpdateTicketDialog } from "@/components/ticket/update-ticket-dialog";

export function TicketDetailPage() {
  return (
    <section className="mt-12 space-y-8">
      <div className="flex flex-col gap-4">
        <BackLink />

        <TicketDetails />
      </div>

      <Separator />

      <TicketComments />

      <UpdateTicketDialog />
    </section>
  );
}
