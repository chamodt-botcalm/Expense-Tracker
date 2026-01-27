export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

/**
 * Backend stores dates as ISO like "2026-01-27" (DATE column).
 * This formats it using the user's preference.
 */
export function formatDateISO(dateISO: string, fmt: DateFormat = "DD/MM/YYYY") {
  if (!dateISO || typeof dateISO !== "string") return "";

  // Expecting YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO);
  if (!m) return dateISO; // fallback if it isn't ISO

  const [, yyyy, mm, dd] = m;

  switch (fmt) {
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${yyyy}`;
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${yyyy}`;
    case "YYYY-MM-DD":
    default:
      return `${yyyy}-${mm}-${dd}`;
  }
}
