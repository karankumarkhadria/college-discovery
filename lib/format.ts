export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  if (value >= 10000000) {
    return `${trimNumber(value / 10000000)} Cr`;
  }

  if (value >= 100000) {
    return `${trimNumber(value / 100000)} L`;
  }

  return formatCurrency(value);
}

export function formatPackage(value: number) {
  return `${trimNumber(value)} LPA`;
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
