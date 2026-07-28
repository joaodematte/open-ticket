import { createFileRoute } from "@tanstack/react-router";

import { TicketDetailPage } from "@/components/ticket/ticket-detail-page";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_protected/ticket/$ticketId")({
  component: TicketDetailPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Visualizar ticket"),
      },
    ],
  }),
});
