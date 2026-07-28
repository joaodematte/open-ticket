import type { RouterOutputs } from "@topsun/api/routers/index";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@topsun/ui/components/empty";
import { Skeleton } from "@topsun/ui/components/skeleton";

import { CommentItem } from "@/components/ticket/comment-item";

type TicketMessage = RouterOutputs["ticket"]["getMessages"][number];

export function CommentList({
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
