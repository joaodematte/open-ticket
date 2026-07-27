import { Link } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@topsun/ui/components/sidebar";

import { NavMain } from "@/components/app-shell/nav-main";
import { NavUser } from "@/components/app-shell/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-2">
        <Link to="/dashboard">
          <img src="/logo.png" alt="Logo" className="mx-auto w-36" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
