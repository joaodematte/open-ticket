import { createFileRoute } from "@tanstack/react-router";

import { CreateTicketPage } from "@/components/ticket/create-ticket-page";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_protected/ticket/create")({
  component: CreateTicketPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Novo ticket"),
      },
    ],
  }),
});
