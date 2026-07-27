import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@topsun/ui/components/sidebar";

import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { getSessionFn } from "@/functions/get-session";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (!session) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
