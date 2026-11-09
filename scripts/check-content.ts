// Comprueba el contenido del curso y la generación de ejercicios: npm run check
import { allLessons, allUnits, LANGS } from '../src/content';
import { buildExamSteps, buildLessonSteps, buildPlacementBlock } from '../src/lib/exercises';
import { checkWritten } from '../src/lib/answer';
import type { LangProgress } from '../src/types';

let errors = 0;
const fail = (m: string) => { errors++; console.error('✗ ' + m); };
const empty = (): LangProgress => ({ placementDone: true, lessons: {}, exams: {}, cards: {}, mistakes: [], skills: { vocab: { correct: 0, total: 0 }, listening: { correct: 0, total: 0 }, writing: { correct: 0, total: 0 }, grammar: { correct: 0, total: 0 } } });

for (const lang of LANGS) {
  const ids = new Set<string>();
  for (const { lesson } of allLessons(lang)) {
    if (lesson.vocab.length < 4) fail(`${lesson.id}: menos de 4 palabras`);
    if (lesson.sentences.length < 3) fail(`${lesson.id}: menos de 3 frases`);
    if (lesson.dialog.lines.length < 4) fail(`${lesson.id}: diálogo corto`);
    for (const it of [...lesson.vocab, ...lesson.sentences]) {
      if (ids.has(it.id)) fail(`id duplicado ${it.id}`);
      ids.add(it.id);
    }
    for (const v of lesson.vocab) if (!checkWritten(v.term, v.term, v.alt).correct) fail(`no se acepta "${v.term}"`);
    for (let run = 0; run < 30; run++) {
      const steps = buildLessonSteps(lang, lesson, empty(), 15);
      for (const s of steps) {
        if (s.type !== 'exercise') continue;
        const e = s.ex;
        if (e.options) {
          if (!e.options.includes(e.answer)) fail(`${lesson.id} ${e.kind}: la respuesta no está entre las opciones`);
          if (new Set(e.options).size !== e.options.length) fail(`${lesson.id} ${e.kind}: opciones repetidas`);
          if (e.options.length < 3) fail(`${lesson.id} ${e.kind}: pocas opciones`);
        }
        if (e.kind === 'build') {
          const words = e.answer.replace(/[.,!?¿¡]/g, '').split(/\s+/);
          if (!words.every((w) => e.tokens!.includes(w))) fail(`${lesson.id}: faltan fichas para "${e.answer}"`);
        }
      }
      if (steps.filter((s) => s.type === 'exercise' && s.ex.graded).length !== 5) fail(`${lesson.id}: el test no tiene 5 preguntas`);
    }
  }
  allUnits(lang).forEach((u, i) => {
    if (buildExamSteps(lang, u).length < 10) fail(`${u.id}: examen corto`);
    if (buildPlacementBlock(lang, i).length !== 4) fail(`${u.id}: bloque de nivel incorrecto`);
  });
  console.log(`${lang}: ${allLessons(lang).length} lecciones, ${ids.size} elementos`);
}
// Tolerancia de respuestas
const t = (g: string, e: string, ok: boolean) => checkWritten(g, e).correct !== ok && fail(`checkWritten("${g}","${e}") != ${ok}`);
t('Good morning', 'good morning', true); t('sondag', 'søndag', true); t('helo', 'hello', false); t('kitchn', 'kitchen', true); t('', 'x', false); t('tea', 'te', false);
if (errors) { console.error(`${errors} errores`); process.exit(1); }
console.log('✓ Contenido correcto');
