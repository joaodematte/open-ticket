import { createFileRoute } from "@tanstack/react-router";

import { MyTickets } from "@/components/dashboard/my-tickets";
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
