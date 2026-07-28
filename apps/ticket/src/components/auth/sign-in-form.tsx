import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@topsun/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@topsun/ui/components/field";
import { Input } from "@topsun/ui/components/input";
import { toast } from "@topsun/ui/components/toast";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLogo } from "@/components/auth/auth-logo";
import { authClient } from "@/lib/auth-client";

const SignInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Campo obrigatório"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export function SignInForm() {
  const navigate = useNavigate();

  const form = useForm<SignInForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.error(error);
      toast.add({
        description: error.message,
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
      return;
    }

    navigate({ to: "/dashboard" });
  });

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <AuthLogo />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="raposo@topsun.com.br"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="current-password"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              Continuar
            </Button>
          </Field>
          <FieldSeparator />
          <Field>
            <FieldDescription className="text-center">
              Caso não tenha uma conta, solicite ao seu supervisor.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
