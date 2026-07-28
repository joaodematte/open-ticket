import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

import { CommentComposer } from "@/components/ticket/comment-composer";
import { CommentList } from "@/components/ticket/comment-list";
import { useTRPC } from "@/utils/trpc";

const ticketRouteApi = getRouteApi("/_protected/ticket/$ticketId");

export function TicketComments() {
  const { ticketId } = ticketRouteApi.useParams();
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
