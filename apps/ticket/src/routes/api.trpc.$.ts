import { createFileRoute } from "@tanstack/react-router";
import { createContext } from "@topsun/api/context";
import { appRouter } from "@topsun/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    createContext,
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
