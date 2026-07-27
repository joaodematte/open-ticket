import { createServerFn } from "@tanstack/react-start";

import { authMiddleware } from "@/middleware/auth";

export const getSessionFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => context.session);
