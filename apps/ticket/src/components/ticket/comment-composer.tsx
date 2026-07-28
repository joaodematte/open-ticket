import { IconSend } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@topsun/ui/components/input-group";
import { toast } from "@topsun/ui/components/toast";
import { useState } from "react";
import type { FormEvent } from "react";

import { useTRPC } from "@/utils/trpc";

export function CommentComposer({ ticketId }: { ticketId: string }) {
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
