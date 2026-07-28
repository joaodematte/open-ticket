export function formatRelativeTime(date: Date) {
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
