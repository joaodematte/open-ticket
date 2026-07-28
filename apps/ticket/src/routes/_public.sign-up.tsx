import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_public/sign-up")({
  component: SignUpForm,
  head: () => ({
    meta: [
      {
        title: getTitle("Novo acesso"),
      },
    ],
  }),
});
