import { createFileRoute, redirect } from "@tanstack/react-router";

import { ProtectedLayout } from "@/components/layout/protected-layout";
import { getSessionFn } from "@/functions/get-session";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: ProtectedLayout,
});
