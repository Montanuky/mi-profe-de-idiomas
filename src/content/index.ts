import type { Course, LangCode, LangProgress, Lesson, Sentence, Unit, VocabItem } from '../types';
import { english } from './en';
import { norwegian } from './no';

export const courses: Record<LangCode, Course> = { en: english, no: norwegian };
export const LANGS: LangCode[] = ['en', 'no'];

export interface LessonRef {
  lesson: Lesson;
  unit: Unit;
  unitIndex: number;
  lessonIndex: number;
}

export function allUnits(lang: LangCode): Unit[] {
  return courses[lang].levels.flatMap((l) => l.units);
}

export function allLessons(lang: LangCode): LessonRef[] {
  const out: LessonRef[] = [];
  allUnits(lang).forEach((unit, unitIndex) =>
    unit.lessons.forEach((lesson, lessonIndex) => out.push({ lesson, unit, unitIndex, lessonIndex })),
  );
  return out;
}

export function findLesson(lessonId: string): (LessonRef & { lang: LangCode }) | null {
  for (const lang of LANGS) {
    const ref = allLessons(lang).find((r) => r.lesson.id === lessonId);
    if (ref) return { ...ref, lang };
  }
  return null;
}

export function findUnit(unitId: string): { unit: Unit; lang: LangCode; index: number } | null {
  for (const lang of LANGS) {
    const units = allUnits(lang);
    const index = units.findIndex((u) => u.id === unitId);
    if (index >= 0) return { unit: units[index], lang, index };
  }
  return null;
}

export type ItemRef =
  | { kind: 'vocab'; item: VocabItem; lesson: Lesson }
  | { kind: 'sentence'; item: Sentence; lesson: Lesson };

let itemIndex: Map<string, ItemRef> | null = null;
export function findItem(id: string): ItemRef | null {
  if (!itemIndex) {
    itemIndex = new Map();
    for (const lang of LANGS)
      for (const { lesson } of allLessons(lang)) {
        lesson.vocab.forEach((item) => itemIndex!.set(item.id, { kind: 'vocab', item, lesson }));
        lesson.sentences.forEach((item) => itemIndex!.set(item.id, { kind: 'sentence', item, lesson }));
      }
  }
  return itemIndex.get(id) ?? null;
}

export function allVocab(lang: LangCode): VocabItem[] {
  return allLessons(lang).flatMap((r) => r.lesson.vocab);
}

export function langOfId(id: string): LangCode {
  return id.startsWith('no') ? 'no' : 'en';
}

// ----- Desbloqueo: no se avanza sin haber aprobado lo anterior -----

export function isLessonUnlocked(lang: LangCode, lessonId: string, p: LangProgress): boolean {
  const units = allUnits(lang);
  for (let u = 0; u < units.length; u++) {
    const idx = units[u].lessons.findIndex((l) => l.id === lessonId);
    if (idx < 0) continue;
    if (idx > 0) return !!p.lessons[units[u].lessons[idx - 1].id]?.passed;
    if (u === 0) return true;
    return !!p.exams[units[u - 1].id]?.passed;
  }
  return false;
}

export function isExamUnlocked(unit: Unit, p: LangProgress): boolean {
  return unit.lessons.every((l) => p.lessons[l.id]?.passed);
}

export type NextStep =
  | { type: 'lesson'; ref: LessonRef }
  | { type: 'exam'; unit: Unit }
  | { type: 'done' };

export function nextStep(lang: LangCode, p: LangProgress): NextStep {
  for (const unit of allUnits(lang)) {
    for (const lesson of unit.lessons) {
      if (!p.lessons[lesson.id]?.passed) {
        const ref = allLessons(lang).find((r) => r.lesson.id === lesson.id)!;
        return { type: 'lesson', ref };
      }
    }
    if (!p.exams[unit.id]?.passed) return { type: 'exam', unit };
  }
  return { type: 'done' };
}

/** Porcentaje del curso disponible completado (lecciones + exámenes aprobados). */
export function courseCompletion(lang: LangCode, p: LangProgress): number {
  const units = allUnits(lang);
  const total = units.reduce((n, u) => n + u.lessons.length + 1, 0);
  const done = units.reduce(
    (n, u) => n + u.lessons.filter((l) => p.lessons[l.id]?.passed).length + (p.exams[u.id]?.passed ? 1 : 0),
    0,
  );
  return total ? done / total : 0;
}
