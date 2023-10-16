export function formatCurrency(number: number) {
  const isWholeNumber = number % 1 === 0;

  const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: isWholeNumber ? 0 : 2,
  })

  return CURRENCY_FORMATTER.format(number)
}