export type CurrencyCode = "KES" | "USD" | "EUR" | "GBP";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  KES: "KSh", // Uses standard local display symbol for Kenyan Shilling
};

export function formatMoney(
  amount: number,
  currency: CurrencyCode = "KES",
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formattedAmount}`;
}
