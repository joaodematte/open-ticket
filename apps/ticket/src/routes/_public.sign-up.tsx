import { createFileRoute } from "@tanstack/react-router";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const Route = createFileRoute("/_public/sign-up")({
  component: SignUpForm,
});
