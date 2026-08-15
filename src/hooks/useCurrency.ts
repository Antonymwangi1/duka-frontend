import { useAuthStore } from "@/store/auth.store";
import { formatMoney, CurrencyCode } from "@/lib/formatters";

export function useCurrency() {
  const { shop } = useAuthStore();

  // Default to KES if shop settings aren't loaded yet
  const currency = (shop?.currency as CurrencyCode) || "KES";

  const money = (amount: number) => formatMoney(amount, currency);

  return {
    currency,
    money, // Function to quickly format numbers: money(12.50) -> "$ 12.50" or "KSh 12.50"
  };
}
