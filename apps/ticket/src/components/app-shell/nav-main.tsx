import { SidebarGroup, SidebarMenu } from "@topsun/ui/components/sidebar";

import { NavItem } from "@/components/app-shell/nav-item";
import { NAVIGATION_ITEMS } from "@/utils/navigation";

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {NAVIGATION_ITEMS.map((item) => (
          <NavItem item={item} key={item.title} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
