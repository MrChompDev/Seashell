export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
}

export function statusChipClass(status: string): string {
  switch (status) {
    case "Approved":
      return "bg-copper-400/15 text-copper-300 border-copper-400/40";
    case "Denied":
      return "bg-red-500/10 text-red-300 border-red-400/30";
    default:
      return "bg-amber-400/10 text-amber-300 border-amber-400/30";
  }
}
