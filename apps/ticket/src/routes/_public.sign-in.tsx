import { createFileRoute } from "@tanstack/react-router";

import { SignInForm } from "@/components/auth/sign-in-form";

export const Route = createFileRoute("/_public/sign-in")({
  component: SignInForm,
});
