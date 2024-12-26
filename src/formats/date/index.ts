export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
}
