import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export function BackLink() {
  return (
    <Link
      to="/dashboard"
      className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-2 text-sm hover:underline"
    >
      <IconArrowLeft className="size-3" /> Voltar
    </Link>
  );
}
