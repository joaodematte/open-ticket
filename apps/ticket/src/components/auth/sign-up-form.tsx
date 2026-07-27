import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@topsun/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@topsun/ui/components/field";
import { Input } from "@topsun/ui/components/input";
import { toast } from "@topsun/ui/components/toast";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const SignUpSchema = z
  .object({
    email: z.email("Email inválido"),
    firstName: z.string().min(1, "Campo obrigatório"),
    lastName: z.string().min(1, "Campo obrigatório"),
    password: z.string().min(1, "Campo obrigatório"),
    passwordConfirmation: z.string().min(1, "Campo obrigatório"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

type SignUpForm = z.infer<typeof SignUpSchema>;

export function SignUpForm() {
  const navigate = useNavigate();

  const form = useForm<SignUpForm>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      password: values.password,
    });

    if (error) {
      toast.add({
        description: error.message,
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
      return;
    }

    navigate({ to: "/" });
  });

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <Link to="/">
            <img
              src="/logo.png"
              alt="TOPSUN Energia"
              className="mx-auto w-42"
            />
          </Link>
          <div className="flex flex-col gap-4 md:flex-row">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Fausto"
                    autoComplete="given-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Sobrenome</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Silva"
                    autoComplete="family-name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
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
                  autoComplete="new-password"
                  type="password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="passwordConfirmation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="new-password"
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
              Solicitar acesso
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
