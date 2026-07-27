import type { Icon } from "@tabler/icons-react";
import { IconHomeFilled } from "@tabler/icons-react";

import type { FileRoutesByTo } from "@/routeTree.gen";

type ValidRoute = keyof FileRoutesByTo;

interface NavigationItemBase {
  title: string;
  icon: Icon;
}

export interface NavigationItemWithHref extends NavigationItemBase {
  href: ValidRoute;
}

export interface NavigationItemWithItems extends NavigationItemBase {
  items: Omit<NavigationItemWithHref, "icon">[];
}

export type NavigationItem = NavigationItemWithHref | NavigationItemWithItems;

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: IconHomeFilled,
    title: "Página inicial",
  },
];
