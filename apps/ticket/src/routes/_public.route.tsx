import { createFileRoute, redirect } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/public-layout";
import { getSessionFn } from "@/functions/get-session";

export const Route = createFileRoute("/_public")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: PublicLayout,
});
