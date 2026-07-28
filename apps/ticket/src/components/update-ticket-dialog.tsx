import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { Button } from "@topsun/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@topsun/ui/components/dialog";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
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
import { toast } from "@topsun/ui/components/toast";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useUpdateDialogStore } from "@/stores/update-dialog";
import { statusIcons, statusLabels, statusOptions } from "@/utils/ticket";
import { useTRPC } from "@/utils/trpc";

type User = RouterOutputs["ticket"]["getAssignableUsers"][number];

const UpdateTicketSchema = z.object({
  assigneeId: z.string().optional(),
  estimatedTime: z
    .string()
    .optional()
    .refine((value) => {
      if (value === undefined || value.trim() === "") {
        return true;
      }

      const hours = Number(value.replace(",", "."));

      return Number.isFinite(hours) && hours >= 0;
    }, "Informe um valor decimal válido"),
  status: z.enum(["open", "in_progress", "closed", "cancelled"]),
});

type UpdateTicketFormValues = z.infer<typeof UpdateTicketSchema>;

function parseEstimatedHoursToSeconds(
  estimatedTimeHours: string | undefined
): number | undefined {
  if (estimatedTimeHours === undefined || estimatedTimeHours.trim() === "") {
    return undefined;
  }

  const hours = Number(estimatedTimeHours.replace(",", "."));

  return Math.round(hours * 3600);
}

function createAssignableUsersOptions(users: User[] | undefined) {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    label: user.name,
    value: user.id,
  }));
}

export function UpdateTicketDialog() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { toggle, isOpen, ticket } = useUpdateDialogStore();
  const form = useForm<UpdateTicketFormValues>({
    defaultValues: {
      assigneeId: undefined,
      estimatedTime: "",
      status: "open",
    },
    resolver: zodResolver(UpdateTicketSchema),
  });

  const { data: assignableUsers } = useQuery(
    trpc.ticket.getAssignableUsers.queryOptions()
  );

  const { mutateAsync: updateTicket } = useMutation({
    ...trpc.ticket.update.mutationOptions(),
    onError: () => {
      toast.add({
        description: "Não foi possível atualizar o ticket, tente novamente...",
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
    },
    onSuccess: () => {
      toast.add({
        description: "O ticket foi atualizado com sucesso",
        title: "Sucesso!",
        type: "success",
      });

      if (ticket) {
        queryClient.invalidateQueries({
          queryKey: trpc.ticket.getById.queryKey({ id: ticket.id }),
        });
      }

      toggle(null);
    },
  });

  useEffect(() => {
    if (!isOpen || !ticket) {
      return;
    }

    form.reset({
      assigneeId: ticket.assigneeId ?? undefined,
      estimatedTime:
        ticket.estimatedTime === null || ticket.estimatedTime === undefined
          ? ""
          : String(ticket.estimatedTime / 3600),
      status: ticket.status,
    });
  }, [form, isOpen, ticket]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!ticket) {
      return;
    }

    const estimatedTime = parseEstimatedHoursToSeconds(values.estimatedTime);

    await updateTicket({
      assigneeId: values.assigneeId,
      estimatedTime,
      id: ticket.id,
      status: values.status,
    });
  });

  const assignableUsersOptions = createAssignableUsersOptions(assignableUsers);

  return (
    <Dialog open={isOpen} onOpenChange={() => toggle(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar ticket</DialogTitle>
          <DialogDescription>
            Atualize as informações do ticket para continuar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name="estimatedTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tempo estimado</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insira um valor decimal em horas (ex.: 1,5)"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => {
                const handleStatusChange = field.onChange;
                const {
                  icon: SelectedStatusIcon,
                  iconClassName: SelectedStatusIconClassName,
                } = statusIcons[field.value];
                const selectedStatusLabel = statusLabels[field.value];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      items={statusOptions}
                      value={field.value}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um status...">
                          <SelectedStatusIcon
                            className={SelectedStatusIconClassName}
                          />
                          {selectedStatusLabel}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statusOptions.map(({ label, value }) => {
                            const statusIcon = statusIcons[value];

                            return (
                              <SelectItem
                                key={value ?? "status-placeholder"}
                                value={value}
                              >
                                <statusIcon.icon
                                  className={statusIcon.iconClassName}
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

            <Controller
              name="assigneeId"
              control={form.control}
              render={({ field, fieldState }) => {
                const handleAssigneeChange = field.onChange;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Responsável</FieldLabel>
                    <Select
                      items={assignableUsersOptions}
                      value={field.value}
                      onValueChange={handleAssigneeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um responsável..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {assignableUsersOptions.map(({ label, value }) => (
                            <SelectItem
                              key={value ?? "assignee-placeholder"}
                              value={value}
                            >
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

            <Field>
              <Button type="submit" isLoading={form.formState.isSubmitting}>
                Atualizar ticket
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
