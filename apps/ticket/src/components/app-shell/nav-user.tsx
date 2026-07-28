import { IconLogout, IconSelector } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@topsun/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@topsun/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@topsun/ui/components/sidebar";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { authClient } from "@/lib/auth-client";

function getUserNameInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

export function NavUser() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
    navigate({ to: "/sign-in" });
  };

  if (!session || !session.user || isPending) {
    return <Skeleton className="h-12 w-full" />;
  }

  const userNameInitials = getUserNameInitials(session.user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage
                src={session.user.image ?? ""}
                alt={session.user.name}
              />
              <AvatarFallback>{userNameInitials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session.user.name}</span>
              <span className="truncate text-xs">{session.user.email}</span>
            </div>
            <IconSelector className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit font-medium"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem variant="destructive" onClick={signOut}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
