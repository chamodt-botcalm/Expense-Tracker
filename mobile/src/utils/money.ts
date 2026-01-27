const symbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  LKR: "₨",
};

export function formatMoney(amount: number, currency: string = "USD") {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);

  const code = (currency || "USD").toUpperCase();
  const symbol = symbols[code] ?? `${code} `;

  // Examples:
  // - $123.45
  // - ₨123.45
  // - GBP 123.45 (fallback)
  return `${sign}${symbol}${abs.toFixed(2)}`;
}
