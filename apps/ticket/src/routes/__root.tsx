import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import type { AppRouter } from "@topsun/api/routers/index";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { RootDocument } from "@/components/layout/root-document";
import { getTitle } from "@/utils/seo";

import appCss from "@topsun/ui/globals.css?url";

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootDocument,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      {
        href: "/favicon.svg",
        rel: "icon",
        type: "image/svg+xml",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: getTitle(),
      },
    ],
  }),
});
