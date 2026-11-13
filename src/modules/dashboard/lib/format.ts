import { formatDistanceToNowStrict } from "date-fns";

export function formatEdited(date: Date) {
  if (Date.now() - date.getTime() < 60_000) return "Edited just now";
  return `Edited ${formatDistanceToNowStrict(date, { addSuffix: true })}`;
}
