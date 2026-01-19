export function formatMoney(v: string | number) {
  const n = typeof v === 'string' ? Number(v) : v;
  if (Number.isNaN(n)) return '-';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

export function clampPage(p: number, totalPages: number) {
  return Math.min(Math.max(p, 1), Math.max(totalPages, 1));
}
