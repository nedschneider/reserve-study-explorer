/** Format a number as US currency, no cents. Negative shown with a minus. */
export function usd(n: number): string {
  const rounded = Math.round(Math.abs(n));
  const formatted = rounded.toLocaleString("en-US");
  return n < 0 ? `−$${formatted}` : `$${formatted}`;
}

/** Format as currency with explicit sign: + / −. Zero shows no sign. */
export function usdSigned(n: number): string {
  const rounded = Math.round(Math.abs(n));
  const formatted = rounded.toLocaleString("en-US");
  if (n < 0) return `−$${formatted}`;
  if (n > 0) return `+$${formatted}`;
  return `$${formatted}`;
}

/** Format a 0..1 ratio as a percent, e.g. −0.26 → "−26%". */
export function pct(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}${Math.round(Math.abs(n) * 100)}%`;
}

/** Compact currency for axis ticks, e.g. −$256k. */
export function usdCompact(n: number): string {
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sign}$${Math.round(abs / 1000)}k`;
  return `${sign}$${Math.round(abs)}`;
}
