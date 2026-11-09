import { courseCompletion, findItem } from '../content';
import type { AppData, LangCode } from '../types';
import { streak, todayKey } from './date';
import { dueCards } from './exercises';
import { cardStatus } from './srs';

export function langStats(data: AppData, lang: LangCode) {
  const p = data.langs[lang];
  const cards = Object.values(p.cards).filter((c) => findItem(c.id));
  const vocabCards = cards.filter((c) => c.kind === 'vocab');
  const statuses = vocabCards.map(cardStatus);
  return {
    completion: courseCompletion(lang, p),
    due: dueCards(p).length,
    learned: vocabCards.length,
    known: statuses.filter((s) => s === 'conocida' || s === 'dominada').length,
    mastered: statuses.filter((s) => s === 'dominada').length,
    hard: statuses.filter((s) => s === 'difícil').length,
    lessonsPassed: Object.values(p.lessons).filter((l) => l.passed).length,
  };
}

export function globalStats(data: AppData) {
  const days = new Set(Object.entries(data.activity).filter(([, a]) => a.seconds >= 30 || a.xp > 0).map(([k]) => k));
  const today = data.activity[todayKey()];
  const goal = (data.profile?.dailyMinutes ?? 15) * 60;
  const totalSeconds = Object.values(data.activity).reduce((n, a) => n + a.seconds, 0);
  return {
    streak: streak(days),
    activeDays: days,
    todaySeconds: today?.seconds ?? 0,
    todayXp: today?.xp ?? 0,
    goalSeconds: goal,
    goalProgress: Math.min(1, (today?.seconds ?? 0) / goal),
    totalMinutes: Math.round(totalSeconds / 60),
  };
}
