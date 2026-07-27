import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getSessionFn } from "@/functions/get-session";

export const Route = createFileRoute("/_public")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background flex h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
