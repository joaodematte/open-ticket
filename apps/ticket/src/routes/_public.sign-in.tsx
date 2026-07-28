import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "@/components/auth/sign-in-form";
import { getTitle } from "@/utils/seo";

export const Route = createFileRoute("/_public/sign-in")({
  component: SignInForm,
  head: () => ({
    meta: [
      {
        title: getTitle("Autenticação"),
      },
    ],
  }),
});
