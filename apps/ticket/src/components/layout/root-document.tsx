import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "@topsun/ui/components/toast";

export function RootDocument() {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
