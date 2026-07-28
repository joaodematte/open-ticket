import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "@topsun/ui/components/toast";

import { authClient } from "@/lib/auth-client";
import { formatRelativeTime } from "@/utils/date";
import { useTRPC } from "@/utils/trpc";

type TicketMessage = RouterOutputs["ticket"]["getMessages"][number];

export function CommentItem({
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
