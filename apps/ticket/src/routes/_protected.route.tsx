import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { UserMenu } from "@/components/user-menu";
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
    <main className="mx-auto w-full max-w-4xl px-6 py-24">
      <header className="flex items-center justify-between">
        <Link to="/dashboard">
          <img src="/logo.png" alt="Logo" className="w-36" />
        </Link>
        <UserMenu />
      </header>

      <Outlet />
    </main>
  );
}
