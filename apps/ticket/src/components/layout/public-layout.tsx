import { Outlet } from "@tanstack/react-router";

export function PublicLayout() {
  return (
    <div className="bg-background flex h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
