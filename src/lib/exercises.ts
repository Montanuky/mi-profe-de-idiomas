// Generación de ejercicios y sesiones a partir del contenido del curso.
import { allLessons, allUnits, courses, findItem } from '../content';
import type { DialogLine, LangCode, LangProgress, Lesson, Sentence, Skill, Tip, Unit, VocabItem } from '../types';
import { isDue } from './srs';

export type ExerciseKind = 'choose' | 'reverse' | 'listen' | 'write' | 'build' | 'listenSentence' | 'match' | 'dialog';

export interface Exercise {
  key: string;
  kind: ExerciseKind;
  skill: Skill;
  itemId?: string;
  itemKind?: 'vocab' | 'sentence';
  instruction: string;
  prompt?: string;
  emoji?: string;
  speak?: string; // texto que se puede escuchar
  options?: string[];
  answer: string;
  alts?: string[];
  tokens?: string[];
  pairs?: { id: string; left: string; right: string }[];
  context?: DialogLine[];
  explanation: string;
  graded?: boolean;
}

export type Step =
  | { type: 'section'; title: string; subtitle: string; emoji: string }
  | { type: 'card'; item: VocabItem }
  | { type: 'tip'; tip: Tip }
  | { type: 'dialog'; title: string; lines: DialogLine[] }
  | { type: 'exercise'; ex: Exercise };

export const SKILL_OF: Record<ExerciseKind, Skill> = {
  choose: 'vocab',
  reverse: 'vocab',
  match: 'vocab',
  listen: 'listening',
  listenSentence: 'listening',
  write: 'writing',
  build: 'grammar',
  dialog: 'grammar',
};

export const SKILL_NAMES: Record<Skill, string> = {
  vocab: 'Vocabulario',
  listening: 'Comprensión auditiva',
  writing: 'Escritura',
  grammar: 'Gramática y frases',
};

let counter = 0;
const uid = () => `x${Date.now().toString(36)}${(counter++).toString(36)}`;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function options(answer: string, pool: string[], n = 4): string[] {
  const distractors = pick([...new Set(pool.filter((p) => p !== answer))], n - 1);
  return shuffle([answer, ...distractors]);
}

function vocabExplanation(item: VocabItem): string {
  return `"${item.term}" significa "${item.es}".${item.note ? ' ' + item.note : ''}`;
}

/** Palabras del mismo idioma para usar como opciones incorrectas (primero las cercanas). */
function vocabPool(lang: LangCode, near: VocabItem[]): VocabItem[] {
  const all = allLessons(lang).flatMap((r) => r.lesson.vocab);
  return near.length >= 4 ? near : [...near, ...all.filter((v) => !near.includes(v))];
}

export function vocabExercise(lang: LangCode, item: VocabItem, kind: ExerciseKind, near: VocabItem[]): Exercise {
  const pool = vocabPool(lang, near).filter((v) => v.id !== item.id && v.es !== item.es && v.term !== item.term);
  const base = {
    key: uid(),
    kind,
    skill: SKILL_OF[kind],
    itemId: item.id,
    itemKind: 'vocab' as const,
    explanation: vocabExplanation(item),
    emoji: item.emoji,
  };
  switch (kind) {
    case 'reverse':
      return { ...base, instruction: '¿Cómo se dice?', prompt: item.es, answer: item.term, options: options(item.term, pool.map((p) => p.term)) };
    case 'listen':
      return { ...base, emoji: undefined, instruction: 'Escucha y elige lo que oyes', speak: item.term, answer: item.term, options: options(item.term, pool.map((p) => p.term)) };
    case 'write':
      return { ...base, instruction: 'Escríbelo en ' + courses[lang].name.toLowerCase(), prompt: item.es, answer: item.term, alts: item.alt };
    case 'choose':
    default:
      return { ...base, kind: 'choose', skill: 'vocab', instruction: '¿Qué significa?', prompt: item.term, speak: item.term, answer: item.es, options: options(item.es, pool.map((p) => p.es)) };
  }
}

function tokenize(text: string): string[] {
  return text.replace(/[.,!?¿¡]/g, '').split(/\s+/).filter(Boolean);
}

export function sentenceExercise(lang: LangCode, s: Sentence, kind: 'build' | 'listenSentence', lesson?: Lesson): Exercise {
  const others = allLessons(lang).flatMap((r) => r.lesson.sentences).filter((o) => o.id !== s.id);
  const tip = lesson ? ` Repasa: «${lesson.tip.title}».` : '';
  if (kind === 'listenSentence') {
    return {
      key: uid(),
      kind,
      skill: 'listening',
      itemId: s.id,
      itemKind: 'sentence',
      instruction: 'Escucha la frase y elige su significado',
      speak: s.text,
      answer: s.es,
      options: options(s.es, others.map((o) => o.es)),
      explanation: `Has escuchado "${s.text}", que significa "${s.es}".`,
    };
  }
  const words = tokenize(s.text);
  const extra = pick(
    others.flatMap((o) => tokenize(o.text)).filter((w) => !words.map((x) => x.toLowerCase()).includes(w.toLowerCase())),
    2,
  );
  return {
    key: uid(),
    kind: 'build',
    skill: 'grammar',
    itemId: s.id,
    itemKind: 'sentence',
    instruction: 'Ordena las palabras para traducir',
    prompt: s.es,
    speak: s.text,
    answer: s.text,
    tokens: shuffle([...words, ...extra]),
    explanation: `La frase correcta es "${s.text}".${tip}`,
  };
}

export function matchExercise(items: VocabItem[]): Exercise {
  const chosen = pick(items, Math.min(4, items.length));
  return {
    key: uid(),
    kind: 'match',
    skill: 'vocab',
    instruction: 'Juego: une cada palabra con su traducción',
    answer: '',
    pairs: chosen.map((v) => ({ id: v.id, left: v.term, right: v.es })),
    explanation: chosen.map((v) => `${v.term} = ${v.es}`).join(' · '),
  };
}

export function dialogExercise(lang: LangCode, lesson: Lesson, lineIndex: number): Exercise {
  const lines = lesson.dialog.lines;
  const target = lines[lineIndex];
  const pool = allLessons(lang)
    .flatMap((r) => r.lesson.dialog.lines)
    .filter((l) => l.text !== target.text && !lines.includes(l))
    .map((l) => l.text);
  return {
    key: uid(),
    kind: 'dialog',
    skill: 'grammar',
    instruction: 'Completa la conversación: ¿qué se dice ahora?',
    context: lines.slice(Math.max(0, lineIndex - 2), lineIndex),
    answer: target.text,
    speak: target.text,
    options: options(target.text, pool, 3),
    explanation: `Lo natural aquí es "${target.text}" (${target.es}).`,
  };
}

// ----- Adaptación: el punto débil recibe más práctica -----

export function weakestSkill(p: LangProgress): Skill | null {
  let worst: Skill | null = null;
  let worstRate = 0.85; // solo si baja de 85 % de aciertos
  (Object.keys(p.skills) as Skill[]).forEach((s) => {
    const { correct, total } = p.skills[s];
    if (total < 6) return;
    const rate = correct / total;
    if (rate < worstRate) {
      worstRate = rate;
      worst = s;
    }
  });
  return worst;
}

const KIND_FOR_SKILL: Record<Skill, 'listen' | 'write' | 'reverse' | 'build'> = {
  listening: 'listen',
  writing: 'write',
  vocab: 'reverse',
  grammar: 'build',
};

/** Tarjetas que tocan repasar hoy, primero las más atrasadas y las más difíciles. */
export function dueCards(p: LangProgress) {
  return Object.values(p.cards)
    .filter((c) => isDue(c) && findItem(c.id))
    .sort((a, b) => (a.due === b.due ? b.lapses - a.lapses : a.due < b.due ? -1 : 1));
}

function reviewExerciseFor(lang: LangCode, cardId: string, reps: number, weak: Skill | null): Exercise | null {
  const ref = findItem(cardId);
  if (!ref) return null;
  if (ref.kind === 'sentence') {
    const kind = weak === 'listening' || Math.random() < 0.3 ? 'listenSentence' : 'build';
    return sentenceExercise(lang, ref.item, kind, ref.lesson);
  }
  let kinds: ExerciseKind[] = reps < 2 ? ['choose', 'reverse', 'listen'] : ['reverse', 'listen', 'write', 'write'];
  if (weak) kinds = [...kinds, KIND_FOR_SKILL[weak], KIND_FOR_SKILL[weak]];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  return vocabExercise(lang, ref.item, kind, ref.lesson.vocab);
}

export const WARMUP_BY_MINUTES: Record<number, number> = { 10: 2, 15: 3, 20: 4, 30: 6 };
export const REVIEW_BY_MINUTES: Record<number, number> = { 10: 10, 15: 15, 20: 20, 30: 30 };

// ----- Sesiones -----

export function buildLessonSteps(lang: LangCode, lesson: Lesson, p: LangProgress, minutes: number): Step[] {
  const steps: Step[] = [];
  const weak = weakestSkill(p);
  const newIds = new Set([...lesson.vocab.map((v) => v.id), ...lesson.sentences.map((s) => s.id)]);

  // 1. Repaso de lo anterior
  const warm = dueCards(p).filter((c) => !newIds.has(c.id)).slice(0, WARMUP_BY_MINUTES[minutes] ?? 3);
  if (warm.length) {
    steps.push({ type: 'section', emoji: '🔁', title: 'Calentamiento', subtitle: 'Primero repasamos lo que toca recordar hoy.' });
    warm.forEach((c) => {
      const ex = reviewExerciseFor(lang, c.id, c.reps, weak);
      if (ex) steps.push({ type: 'exercise', ex });
    });
  }

  // 2. Vocabulario nuevo, con práctica inmediata cada dos palabras
  steps.push({ type: 'section', emoji: '✨', title: lesson.title, subtitle: lesson.goal });
  const v = lesson.vocab;
  for (let i = 0; i < v.length; i += 2) {
    const pair = v.slice(i, i + 2);
    pair.forEach((item) => steps.push({ type: 'card', item }));
    pair.forEach((item) => steps.push({ type: 'exercise', ex: vocabExercise(lang, item, 'choose', v) }));
  }

  // 3. Explicación sencilla
  steps.push({ type: 'tip', tip: lesson.tip });

  // 4 y 5. Ejercicios prácticos, escucha y frases
  const practice: Exercise[] = [];
  shuffle(v).forEach((item, i) => practice.push(vocabExercise(lang, item, i % 2 === 0 ? 'reverse' : 'listen', v)));
  practice.push(matchExercise(v));
  lesson.sentences.forEach((s) => practice.push(sentenceExercise(lang, s, 'build', lesson)));
  practice.push(sentenceExercise(lang, pick(lesson.sentences, 1)[0], 'listenSentence', lesson));
  if (weak) {
    // Refuerzo extra del punto débil detectado
    pick(v, 2).forEach((item) => {
      const k = KIND_FOR_SKILL[weak];
      practice.push(k === 'build' ? sentenceExercise(lang, pick(lesson.sentences, 1)[0], 'build', lesson) : vocabExercise(lang, item, k, v));
    });
  }
  steps.push({ type: 'section', emoji: '💪', title: 'Práctica', subtitle: 'Si fallas algo, volverá a salir hasta que lo aciertes.' });
  shuffle(practice.slice(0, v.length)).concat(practice.slice(v.length)).forEach((ex) => steps.push({ type: 'exercise', ex }));

  // 6. Pequeña conversación
  steps.push({ type: 'dialog', title: lesson.dialog.title, lines: lesson.dialog.lines });
  steps.push({ type: 'exercise', ex: dialogExercise(lang, lesson, 1) });
  steps.push({ type: 'exercise', ex: dialogExercise(lang, lesson, 3) });

  // 7. Test final (cuenta para aprobar la lección)
  steps.push({ type: 'section', emoji: '🎯', title: 'Test final', subtitle: 'Necesitas acertar 4 de 5 para superar la lección.' });
  const [w1, w2, r1, l1] = pick(v, 4);
  const test: Exercise[] = [
    vocabExercise(lang, w1, 'write', v),
    vocabExercise(lang, w2, 'write', v),
    vocabExercise(lang, r1, 'reverse', v),
    vocabExercise(lang, l1, 'listen', v),
    sentenceExercise(lang, pick(lesson.sentences, 1)[0], 'build', lesson),
  ];
  shuffle(test).forEach((ex) => steps.push({ type: 'exercise', ex: { ...ex, graded: true } }));
  return steps;
}

export function buildReviewSteps(lang: LangCode, p: LangProgress, minutes: number, mode: 'due' | 'hard'): Step[] {
  const weak = weakestSkill(p);
  const limit = REVIEW_BY_MINUTES[minutes] ?? 15;
  const cards =
    mode === 'due'
      ? dueCards(p).slice(0, limit)
      : Object.values(p.cards)
          .filter((c) => findItem(c.id) && c.wrong > 0)
          .sort((a, b) => b.wrong - b.correct - (a.wrong - a.correct))
          .slice(0, limit);
  return cards
    .map((c) => reviewExerciseFor(lang, c.id, c.reps, weak))
    .filter((e): e is Exercise => !!e)
    .map((ex) => ({ type: 'exercise' as const, ex }));
}

function unitExercises(lang: LangCode, unit: Unit, n: number): Exercise[] {
  const out: Exercise[] = [];
  const vocab = unit.lessons.flatMap((l) => l.vocab);
  const kinds: ExerciseKind[] = ['write', 'reverse', 'listen', 'build', 'write', 'listenSentence', 'reverse', 'dialog', 'build', 'write', 'listen', 'reverse'];
  for (let i = 0; i < n; i++) {
    const lesson = unit.lessons[i % unit.lessons.length];
    const kind = kinds[i % kinds.length];
    if (kind === 'build' || kind === 'listenSentence')
      out.push(sentenceExercise(lang, pick(lesson.sentences, 1)[0], kind, lesson));
    else if (kind === 'dialog') out.push(dialogExercise(lang, lesson, 1 + 2 * Math.floor(Math.random() * 2)));
    else out.push(vocabExercise(lang, pick(lesson.vocab, 1)[0], kind, vocab));
  }
  // Evita preguntar dos veces por lo mismo
  const seen = new Set<string>();
  return out.filter((e) => {
    const k = e.itemId ? e.itemId + e.kind : e.key;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export const EXAM_PASS = 0.8;

export function buildExamSteps(lang: LangCode, unit: Unit): Step[] {
  return shuffle(unitExercises(lang, unit, 12)).map((ex) => ({ type: 'exercise', ex: { ...ex, graded: true } }));
}

/** Prueba de nivel: 4 preguntas por unidad; se aprueba la unidad con 3 de 4. */
export function buildPlacementBlock(lang: LangCode, unitIndex: number): Step[] {
  const unit = allUnits(lang)[unitIndex];
  const lesson = (i: number) => unit.lessons[i % unit.lessons.length];
  const vocab = unit.lessons.flatMap((l) => l.vocab);
  const exs: Exercise[] = [
    vocabExercise(lang, pick(lesson(0).vocab, 1)[0], 'reverse', vocab),
    vocabExercise(lang, pick(lesson(1).vocab, 1)[0], 'listen', vocab),
    sentenceExercise(lang, pick(lesson(2).sentences, 1)[0], 'build', lesson(2)),
    vocabExercise(lang, pick(vocab, 1)[0], 'write', vocab),
  ];
  return exs.map((ex) => ({ type: 'exercise', ex: { ...ex, graded: true } }));
}
