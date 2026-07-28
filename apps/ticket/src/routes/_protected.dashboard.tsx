import { createFileRoute } from "@tanstack/react-router";

import { MyTickets } from "@/components/my-tickets";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_protected/dashboard")({
  component: MyTickets,
  head: () => ({
    meta: [
      {
        title: getTitle("Dashboard"),
      },
    ],
  }),
});
