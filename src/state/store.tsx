// Estado de la app: se guarda en el propio teléfono (AsyncStorage), sin servidores.
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { allUnits, findItem } from '../content';
import type { Exercise } from '../lib/exercises';
import { todayKey } from '../lib/date';
import { grade, newCard } from '../lib/srs';
import type { AppData, LangCode, LangProgress, Mistake, Profile } from '../types';

const KEY = 'idiomas:data:v1';

const emptyLang = (): LangProgress => ({
  placementDone: false,
  lessons: {},
  exams: {},
  cards: {},
  mistakes: [],
  skills: {
    vocab: { correct: 0, total: 0 },
    listening: { correct: 0, total: 0 },
    writing: { correct: 0, total: 0 },
    grammar: { correct: 0, total: 0 },
  },
});

export const emptyData = (): AppData => ({
  version: 1,
  profile: null,
  activeLang: 'en',
  langs: { en: emptyLang(), no: emptyLang() },
  activity: {},
});

export interface Answer {
  ex: Exercise;
  correct: boolean;
  given: string;
  retry: boolean; // segundo intento tras un fallo
}

export interface SessionSummary {
  lang: LangCode;
  kind: 'lesson' | 'review' | 'exam' | 'placement' | 'practice';
  refId?: string; // id de lección o unidad
  answers: Answer[];
  seconds: number;
  /** Para lecciones y exámenes: nota y si se ha aprobado. */
  score?: number;
  passed?: boolean;
}

interface Store {
  data: AppData;
  ready: boolean;
  saveProfile: (p: Profile) => void;
  updateProfile: (p: Partial<Profile>) => void;
  setActiveLang: (l: LangCode) => void;
  finishSession: (s: SessionSummary) => void;
  addTime: (seconds: number) => void;
  applyPlacement: (lang: LangCode, unitsPassed: number) => void;
  resetLang: (lang: LangCode) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);

function bumpDay(data: AppData, f: (d: AppData['activity'][string]) => void) {
  const k = todayKey();
  const d = { ...(data.activity[k] ?? { seconds: 0, xp: 0, lessons: 0, reviews: 0 }) };
  f(d);
  data.activity = { ...data.activity, [k]: d };
}

function applySession(prev: AppData, s: SessionSummary): AppData {
  const data: AppData = { ...prev, langs: { ...prev.langs } };
  const p: LangProgress = {
    ...data.langs[s.lang],
    cards: { ...data.langs[s.lang].cards },
    skills: { ...data.langs[s.lang].skills },
    lessons: { ...data.langs[s.lang].lessons },
    exams: { ...data.langs[s.lang].exams },
  };

  // Estadísticas por habilidad (solo primeros intentos)
  for (const a of s.answers) {
    if (a.retry) continue;
    const sk = p.skills[a.ex.skill];
    p.skills[a.ex.skill] = { correct: sk.correct + (a.correct ? 1 : 0), total: sk.total + 1 };
  }

  // Repetición espaciada: un fallo en la sesión cuenta como fallo para la tarjeta
  const byItem = new Map<string, { kind: 'vocab' | 'sentence'; ok: boolean }>();
  for (const a of s.answers) {
    const ids = a.ex.kind === 'match' ? (a.ex.pairs ?? []).map((x) => x.id) : a.ex.itemId ? [a.ex.itemId] : [];
    for (const id of ids) {
      const kind = a.ex.itemKind ?? 'vocab';
      const prevOk = byItem.get(id)?.ok ?? true;
      byItem.set(id, { kind, ok: prevOk && a.correct });
    }
  }
  const today = todayKey();
  byItem.forEach(({ kind, ok }, id) => {
    const existing = p.cards[id];
    if (s.kind === 'placement') return;
    if (!existing) {
      p.cards[id] = grade(newCard(id, kind), ok);
    } else {
      // En lecciones y práctica libre solo se reprograma si tocaba repasar o si se ha fallado
      const schedule = s.kind === 'review' ? existing.due <= today : existing.due <= today || !ok;
      p.cards[id] = grade(existing, ok, { schedule });
    }
  });

  // Historial de errores
  const newMistakes: Mistake[] = s.answers
    .filter((a) => !a.correct)
    .map((a) => ({
      date: new Date().toISOString(),
      itemId: a.ex.itemId ?? a.ex.key,
      prompt: a.ex.prompt ?? a.ex.speak ?? a.ex.instruction,
      given: a.given,
      expected: a.ex.answer || a.ex.explanation,
      explanation: a.ex.explanation,
      skill: a.ex.skill,
    }));
  p.mistakes = [...newMistakes, ...p.mistakes].slice(0, 300);

  if (s.kind === 'lesson' && s.refId) {
    const old = p.lessons[s.refId];
    p.lessons[s.refId] = {
      bestScore: Math.max(old?.bestScore ?? 0, s.score ?? 0),
      attempts: (old?.attempts ?? 0) + 1,
      passed: !!old?.passed || !!s.passed,
      completedAt: new Date().toISOString(),
    };
  }
  if (s.kind === 'exam' && s.refId) {
    const old = p.exams[s.refId];
    p.exams[s.refId] = {
      bestScore: Math.max(old?.bestScore ?? 0, s.score ?? 0),
      attempts: (old?.attempts ?? 0) + 1,
      passed: !!old?.passed || !!s.passed,
      completedAt: new Date().toISOString(),
    };
  }
  data.langs[s.lang] = p;

  const correct = s.answers.filter((a) => a.correct).length;
  bumpDay(data, (d) => {
    d.seconds += s.seconds;
    d.xp += correct + (s.passed ? 10 : 0);
    if (s.kind === 'lesson' && s.passed) d.lessons += 1;
    if (s.kind === 'review') d.reviews += s.answers.length;
  });
  return data;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as AppData;
          const base = emptyData();
          setData({ ...base, ...parsed, langs: { en: { ...base.langs.en, ...parsed.langs?.en }, no: { ...base.langs.no, ...parsed.langs?.no } } });
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const saveProfile = useCallback((profile: Profile) => setData((d) => ({ ...d, profile })), []);
  const updateProfile = useCallback(
    (p: Partial<Profile>) => setData((d) => (d.profile ? { ...d, profile: { ...d.profile, ...p } } : d)),
    [],
  );
  const setActiveLang = useCallback((activeLang: LangCode) => setData((d) => ({ ...d, activeLang })), []);
  const finishSession = useCallback((s: SessionSummary) => setData((d) => applySession(d, s)), []);
  const addTime = useCallback(
    (seconds: number) =>
      setData((d) => {
        if (seconds < 5) return d;
        const n = { ...d };
        bumpDay(n, (x) => (x.seconds += seconds));
        return n;
      }),
    [],
  );

  const applyPlacement = useCallback((lang: LangCode, unitsPassed: number) => {
    setData((prev) => {
      const p: LangProgress = { ...prev.langs[lang], lessons: { ...prev.langs[lang].lessons }, exams: { ...prev.langs[lang].exams }, cards: { ...prev.langs[lang].cards }, placementDone: true };
      const now = new Date().toISOString();
      allUnits(lang)
        .slice(0, unitsPassed)
        .forEach((u) => {
          p.exams[u.id] = { bestScore: 1, attempts: 0, passed: true, completedAt: now, viaPlacement: true };
          u.lessons.forEach((l) => {
            p.lessons[l.id] = { bestScore: 1, attempts: 0, passed: true, completedAt: now, viaPlacement: true };
            // Lo que ya sabes entra en el repaso con un intervalo corto para confirmarlo
            [...l.vocab, ...l.sentences].forEach((it) => {
              if (p.cards[it.id] || !findItem(it.id)) return;
              const kind = 'term' in it ? 'vocab' : 'sentence';
              p.cards[it.id] = grade(newCard(it.id, kind), true);
            });
          });
        });
      return { ...prev, langs: { ...prev.langs, [lang]: p } };
    });
  }, []);

  const resetLang = useCallback((lang: LangCode) => setData((d) => ({ ...d, langs: { ...d.langs, [lang]: emptyLang() } })), []);
  const resetAll = useCallback(() => setData(emptyData()), []);

  const value = useMemo(
    () => ({ data, ready, saveProfile, updateProfile, setActiveLang, finishSession, addTime, applyPlacement, resetLang, resetAll }),
    [data, ready, saveProfile, updateProfile, setActiveLang, finishSession, addTime, applyPlacement, resetLang, resetAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fuera de StoreProvider');
  return s;
}
