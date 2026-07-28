import { Link, Outlet } from "@tanstack/react-router";

import { UserMenu } from "@/components/user-menu";

export function ProtectedLayout() {
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
