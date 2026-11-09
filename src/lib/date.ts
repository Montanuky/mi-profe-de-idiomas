// Fechas locales en formato YYYY-MM-DD (sin problemas de zona horaria).

export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

/** Días seguidos estudiando, contando hoy o (si hoy aún no) hasta ayer. */
export function streak(activeDays: Set<string>): number {
  let day = todayKey();
  if (!activeDays.has(day)) day = addDays(day, -1);
  let n = 0;
  while (activeDays.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
export const WEEKDAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
