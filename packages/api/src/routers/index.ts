import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../index";
import { ticketRouter } from "./ticket";

export const appRouter = router({
  ticket: ticketRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
