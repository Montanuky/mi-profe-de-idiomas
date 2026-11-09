// Tipos compartidos de toda la aplicación.

export type LangCode = 'en' | 'no';

/** Una palabra o expresión del curso. */
export interface VocabItem {
  id: string;
  term: string; // en el idioma que se aprende
  es: string; // traducción al español
  emoji: string; // imagen asociada
  alt?: string[]; // otras respuestas válidas al escribir
  example?: string;
  exampleEs?: string;
  note?: string; // pista de pronunciación o de uso, en español
}

/** Una frase completa para escuchar y construir. */
export interface Sentence {
  id: string;
  text: string;
  es: string;
}

export interface DialogLine {
  speaker: 'A' | 'B';
  text: string;
  es: string;
}

export interface Tip {
  title: string;
  body: string; // explicación en español
  examples: { text: string; es: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  goal: string; // "Al terminar sabrás..."
  vocab: VocabItem[];
  tip: Tip;
  sentences: Sentence[];
  dialog: { title: string; lines: DialogLine[] };
}

export interface Unit {
  id: string;
  title: string;
  emoji: string;
  lessons: Lesson[];
}

export interface Level {
  id: string; // 'A1', ...
  title: string;
  description: string;
  units: Unit[];
}

export interface Course {
  lang: LangCode;
  name: string;
  flag: string;
  variant: string;
  speechLang: string; // código de voz para el lector
  extraLetters: string[]; // letras especiales para escribir
  levels: Level[];
}

/** Tarjeta de repetición espaciada (algoritmo SM-2 simplificado). */
export interface SrsCard {
  id: string; // id del VocabItem o Sentence
  kind: 'vocab' | 'sentence';
  ease: number;
  interval: number; // días
  reps: number; // aciertos seguidos
  due: string; // fecha local YYYY-MM-DD
  lapses: number; // veces olvidada
  correct: number;
  wrong: number;
  lastReviewed: string;
}

export type Skill = 'vocab' | 'listening' | 'writing' | 'grammar';

export interface Mistake {
  date: string; // ISO
  itemId: string;
  prompt: string;
  given: string;
  expected: string;
  explanation: string;
  skill: Skill;
}

export interface LessonResult {
  bestScore: number; // 0..1
  attempts: number;
  passed: boolean;
  completedAt: string;
  viaPlacement?: boolean;
}

export interface LangProgress {
  placementDone: boolean;
  lessons: Record<string, LessonResult>;
  exams: Record<string, LessonResult>; // por id de unidad
  cards: Record<string, SrsCard>;
  mistakes: Mistake[];
  skills: Record<Skill, { correct: number; total: number }>;
}

export interface DayActivity {
  seconds: number;
  xp: number;
  lessons: number;
  reviews: number;
}

export type ThemePref = 'system' | 'light' | 'dark';

export interface Profile {
  name: string;
  dailyMinutes: 10 | 15 | 20 | 30;
  createdAt: string;
  theme: ThemePref;
  slowAudio: boolean;
}

export interface AppData {
  version: 1;
  profile: Profile | null;
  activeLang: LangCode;
  langs: Record<LangCode, LangProgress>;
  activity: Record<string, DayActivity>; // por fecha local YYYY-MM-DD
}
