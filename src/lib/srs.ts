// Repetición espaciada basada en SM-2 (el algoritmo de Anki), simplificada a acierto/fallo.
import type { SrsCard } from '../types';
import { addDays, todayKey } from './date';

export function newCard(id: string, kind: SrsCard['kind']): SrsCard {
  return { id, kind, ease: 2.5, interval: 0, reps: 0, due: todayKey(), lapses: 0, correct: 0, wrong: 0, lastReviewed: '' };
}

/** Actualiza la tarjeta tras una respuesta. Si falla, vuelve a salir hoy mismo. */
export function grade(card: SrsCard, correct: boolean, opts: { schedule?: boolean } = {}): SrsCard {
  const c = { ...card, lastReviewed: new Date().toISOString() };
  if (correct) c.correct++;
  else c.wrong++;
  if (opts.schedule === false) return c;

  if (correct) {
    c.reps++;
    if (c.reps === 1) c.interval = 1;
    else if (c.reps === 2) c.interval = 3;
    else c.interval = Math.round(c.interval * c.ease);
    c.ease = Math.min(3, c.ease + 0.05);
  } else {
    if (c.reps > 0) c.lapses++;
    c.reps = 0;
    c.interval = 0;
    c.ease = Math.max(1.3, c.ease - 0.2);
  }
  c.due = addDays(todayKey(), c.interval);
  return c;
}

export function isDue(card: SrsCard, today = todayKey()): boolean {
  return card.due <= today;
}

export type CardStatus = 'nueva' | 'aprendiendo' | 'conocida' | 'dominada' | 'difícil';

export function cardStatus(card: SrsCard): CardStatus {
  if (card.lapses >= 2 || (card.wrong > card.correct && card.wrong >= 2)) return 'difícil';
  if (card.interval >= 21) return 'dominada';
  if (card.interval >= 3) return 'conocida';
  if (card.correct + card.wrong === 0) return 'nueva';
  return 'aprendiendo';
}
