// Pequeñas funciones para escribir el contenido del curso de forma compacta.
import type { DialogLine, LangCode, Lesson, Sentence, Tip, VocabItem } from '../types';

type V = [term: string, es: string, emoji: string, extra?: Partial<Omit<VocabItem, 'id' | 'term' | 'es' | 'emoji'>>];

export interface LessonInput {
  title: string;
  goal: string;
  vocab: V[];
  tip: Tip;
  sentences: [text: string, es: string][];
  dialog: { title: string; lines: [speaker: 'A' | 'B', text: string, es: string][] };
}

export function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function lesson(lang: LangCode, id: string, input: LessonInput): Lesson {
  const vocab: VocabItem[] = input.vocab.map(([term, es, emoji, extra]) => ({
    id: `${lang}:v:${slug(term)}`,
    term,
    es,
    emoji,
    ...extra,
  }));
  const sentences: Sentence[] = input.sentences.map(([text, es]) => ({
    id: `${lang}:s:${slug(text)}`,
    text,
    es,
  }));
  const lines: DialogLine[] = input.dialog.lines.map(([speaker, text, es]) => ({ speaker, text, es }));
  return {
    id,
    title: input.title,
    goal: input.goal,
    vocab,
    tip: input.tip,
    sentences,
    dialog: { title: input.dialog.title, lines },
  };
}
