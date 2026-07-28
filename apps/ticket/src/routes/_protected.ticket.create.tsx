import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@topsun/ui/components/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@topsun/ui/components/field";
import { Input } from "@topsun/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@topsun/ui/components/select";
import { Textarea } from "@topsun/ui/components/textarea";
import { toast } from "@topsun/ui/components/toast";
import { cn } from "@topsun/ui/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getTitle } from "@/utils/seo";
import { priorityIcons, priorityOptions, typeOptions } from "@/utils/ticket";
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute("/_protected/ticket/create")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Novo ticket"),
      },
    ],
  }),
});

const NewTicketSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum([
    "bug",
    "feature",
    "task",
    "improvement",
    "documentation",
    "other",
  ]),
});

type NewTicketFormValues = z.infer<typeof NewTicketSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const form = useForm<NewTicketFormValues>({
    defaultValues: {
      description: "",
      priority: "low",
      title: "",
      type: "bug",
    },
    resolver: zodResolver(NewTicketSchema),
  });

  const { mutateAsync: createTicket } = useMutation({
    ...trpc.ticket.create.mutationOptions(),
    onError: () => {
      toast.add({
        description: "Ocorreu um erro ao criar o ticket, tente novamente...",
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
    },
    onSuccess: ({ id }) => {
      toast.add({
        description: "O seu ticket foi criado e enviado para análise",
        title: "Sucesso!",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: trpc.ticket.getByUser.queryKey(),
      });

      navigate({
        params: {
          ticketId: id,
        },
        to: "/ticket/$ticketId",
      });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createTicket(values);
  });

  return (
    <section className="mt-12 space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm hover:underline"
        >
          <IconArrowLeft className="size-3" /> Voltar
        </Link>

        <div>
          <h1 className="text-xl font-medium">Novo ticket</h1>
          <p className="text-muted-foreground text-sm">
            Crie um novo ticket para solicitar suporte
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Título</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Título do ticket"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex gap-6">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => {
                const handleTypeChange = field.onChange;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Tipo</FieldLabel>
                    <Select
                      items={typeOptions}
                      value={field.value}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {typeOptions.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => {
                const handlePriorityChange = field.onChange;
                const {
                  icon: SelectedIcon,
                  iconClassName: SelectedIconClassName,
                } = priorityIcons[field.value];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Prioridade</FieldLabel>
                    <Select
                      items={priorityOptions}
                      value={field.value}
                      onValueChange={handlePriorityChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          <SelectedIcon
                            className={cn("my-auto", SelectedIconClassName)}
                          />
                          {
                            priorityOptions.find(
                              ({ value }) => value === field.value
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {priorityOptions.map(({ label, value }) => {
                            const { icon: Icon, iconClassName } =
                              priorityIcons[value];

                            return (
                              <SelectItem
                                key={value}
                                value={value}
                                className="items-center"
                              >
                                <Icon
                                  className={cn("my-auto", iconClassName)}
                                />
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </div>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Descrição</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Descrição do ticket"
                  autoComplete="off"
                  className="h-32"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button
              type="submit"
              className="w-fit! self-end"
              isLoading={form.formState.isSubmitting}
            >
              Criar ticket
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </section>
  );
}
