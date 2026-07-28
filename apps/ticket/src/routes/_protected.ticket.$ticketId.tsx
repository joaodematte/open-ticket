import {
  IconArrowLeft,
  IconEdit,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { RouterOutputs } from "@topsun/api/routers/index";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@topsun/ui/components/alert-dialog";
import { Button } from "@topsun/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@topsun/ui/components/input-group";
import { Separator } from "@topsun/ui/components/separator";
import { Skeleton } from "@topsun/ui/components/skeleton";
import { toast } from "@topsun/ui/components/toast";
import { cn } from "@topsun/ui/lib/utils";
import { useState } from "react";
import type { FormEvent } from "react";

import { UpdateTicketDialog } from "@/components/update-ticket-dialog";
import { authClient } from "@/lib/auth-client";
import { useUpdateDialogStore } from "@/stores/update-dialog";
import { getTitle } from "@/utils/seo";
import {
  priorityIcons,
  priorityLabels,
  statusIcons,
  statusLabels,
  typeLabels,
} from "@/utils/ticket";
import { useTRPC } from "@/utils/trpc";

type Ticket = RouterOutputs["ticket"]["getById"];
type TicketMessage = RouterOutputs["ticket"]["getMessages"][number];

export const Route = createFileRoute("/_protected/ticket/$ticketId")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Visualizar ticket"),
      },
    ],
  }),
});

function TicketBody({ ticket }: { ticket: Ticket }) {
  return (
    <div className="col-span-4 space-y-2">
      <h1 className="text-xl font-medium">{ticket.title}</h1>
      <p className="text-muted-foreground text-sm">{ticket.description}</p>
    </div>
  );
}

function TicketActions({ ticket }: { ticket: Ticket }) {
  const { toggle } = useUpdateDialogStore();
  const { data: session } = authClient.useSession();

  const { icon: StatusIcon, iconClassName: statusIconClassName } =
    statusIcons[ticket.status];
  const { icon: PriorityIcon, iconClassName: priorityIconClassName } =
    priorityIcons[ticket.priority];

  return (
    <div className="bg-muted col-span-2 space-y-4 rounded-2xl p-4">
      <div>
        <span className="font-medium">Status</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <StatusIcon className={cn("size-3.5", statusIconClassName)} />
          {statusLabels[ticket.status]}
        </span>
      </div>
      <div>
        <span className="font-medium">Prioridade</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <PriorityIcon className={cn("size-3.5", priorityIconClassName)} />
          {priorityLabels[ticket.priority]}
        </span>
      </div>
      <div>
        <span className="font-medium">Tipo</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {typeLabels[ticket.type]}
        </span>
      </div>
      <div>
        <span className="font-medium">Criado por</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.user?.name ?? "—"}
        </span>
      </div>
      <div>
        <span className="font-medium">Criado em</span>
        <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
          {new Date(ticket.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <div>
        <span className="font-medium">Atualizado em</span>
        <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
          {new Date(ticket.updatedAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <Separator />
      <div>
        <span className="font-medium">Horas estimadas</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.estimatedTime ?? "—"}
        </span>
      </div>
      <div>
        <span className="font-medium">Responsável</span>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {ticket.assignee?.name ?? "—"}
        </span>
      </div>
      {session?.user.role?.toLowerCase() === "admin" && (
        <Button className="w-full" onClick={() => toggle(ticket)}>
          <IconEdit />
          Atualizar ticket
        </Button>
      )}
    </div>
  );
}

function TicketDetails() {
  const { ticketId } = Route.useParams();
  const trpc = useTRPC();

  const { data: ticket, isLoading } = useQuery(
    trpc.ticket.getById.queryOptions({
      id: ticketId,
    })
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-4 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-72 w-full" />
        </div>
        <Skeleton className="col-span-2 h-128.25" />
      </div>
    );
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-6">
      <TicketBody ticket={ticket} />
      <TicketActions ticket={ticket} />
    </div>
  );
}

function formatRelativeTime(date: Date) {
  const minutes = Math.round((Date.now() - date.getTime()) / 60_000);

  if (minutes < 1) {
    return "agora";
  }

  if (minutes < 60) {
    return minutes === 1 ? "1 minuto atrás" : `${minutes} minutos atrás`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return hours === 1 ? "1 hora atrás" : `${hours} horas atrás`;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function CommentComposer({ ticketId }: { ticketId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { isPending, mutateAsync: createMessage } = useMutation({
    ...trpc.ticket.createMessage.mutationOptions(),
    onError: () => {
      toast.add({
        description: "Não foi possível enviar o comentário. Tente novamente.",
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: trpc.ticket.getMessages.queryKey({ ticketId }),
      });
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    await createMessage({
      content: trimmedContent,
      ticketId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup className="h-auto min-h-28 has-[>textarea]:h-auto">
        <InputGroupTextarea
          aria-label="Escreva um comentário"
          className="min-h-24 pt-3"
          disabled={isPending}
          placeholder="Escreva um comentário..."
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <InputGroupAddon
          align="block-end"
          className="border-border/60 w-full justify-end border-t px-3 pt-2 pb-3"
        >
          <InputGroupButton
            disabled={!content.trim() || isPending}
            isLoading={isPending}
            size="sm"
            type="submit"
            variant="default"
          >
            <IconSend className="size-3.5" />
            Enviar
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

function CommentItem({
  comment,
  isTicketClosed,
  ticketId,
}: {
  comment: TicketMessage;
  isTicketClosed: boolean;
  ticketId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const createdAt = new Date(comment.createdAt);

  const isAdmin = session?.user.role === "admin";
  const isAuthor = session?.user.id === comment.userId;
  const canDelete = isAdmin || (isAuthor && !isTicketClosed);

  const { isPending, mutateAsync: deleteMessage } = useMutation({
    ...trpc.ticket.deleteMessage.mutationOptions(),
    onError: () => {
      toast.add({
        description: "Não foi possível excluir o comentário. Tente novamente.",
        title: "Ops, ocorreu um erro!",
        type: "error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.ticket.getMessages.queryKey({ ticketId }),
      });
    },
  });

  const handleDelete = async () => {
    await deleteMessage({
      id: comment.id,
      ticketId,
    });
  };

  return (
    <article className="space-y-2 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
          <span className="font-medium">{comment.user.name}</span>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <time
            className="text-muted-foreground tabular-nums"
            dateTime={createdAt.toISOString()}
          >
            {formatRelativeTime(createdAt)}
          </time>
        </div>
        {canDelete ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  aria-label="Excluir comentário"
                  className="text-muted-foreground shrink-0"
                  disabled={isPending}
                  size="icon-sm"
                  type="button"
                  variant="destructive"
                >
                  <IconTrash className="text-destructive size-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir comentário?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O comentário será removido
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
      <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
        {comment.content}
      </p>
    </article>
  );
}

function CommentList({
  comments,
  isLoading,
  isTicketClosed,
  ticketId,
}: {
  comments: TicketMessage[] | undefined;
  isLoading: boolean;
  isTicketClosed: boolean;
  ticketId: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <Empty className="border py-10">
        <EmptyHeader>
          <EmptyTitle>Nenhum comentário ainda</EmptyTitle>
          <EmptyDescription>
            Seja o primeiro a comentar neste ticket.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="divide-y">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isTicketClosed={isTicketClosed}
          ticketId={ticketId}
        />
      ))}
    </div>
  );
}

function TicketComments() {
  const { ticketId } = Route.useParams();
  const trpc = useTRPC();

  const { data: ticket } = useQuery(
    trpc.ticket.getById.queryOptions({
      id: ticketId,
    })
  );

  const { data: comments, isLoading } = useQuery(
    trpc.ticket.getMessages.queryOptions({
      ticketId,
    })
  );

  const commentCount = comments?.length ?? 0;
  const isTicketClosed = ticket?.status === "closed";

  return (
    <section aria-labelledby="ticket-comments-heading" className="space-y-6">
      <h2 className="text-lg font-medium" id="ticket-comments-heading">
        Comentários ({commentCount})
      </h2>

      <CommentComposer ticketId={ticketId} />

      <CommentList
        comments={comments}
        isLoading={isLoading}
        isTicketClosed={isTicketClosed}
        ticketId={ticketId}
      />
    </section>
  );
}

function RouteComponent() {
  return (
    <section className="mt-12 space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm hover:underline"
        >
          <IconArrowLeft className="size-3" /> Voltar
        </Link>

        <TicketDetails />
      </div>

      <Separator />

      <TicketComments />

      <UpdateTicketDialog />
    </section>
  );
}
