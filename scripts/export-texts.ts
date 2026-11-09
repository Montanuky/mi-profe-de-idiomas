// Lista todos los textos que la app puede leer en voz alta, por idioma:
//   npx tsx scripts/export-texts.ts
// Escribe audio/<idioma>/manifest.json, que el workflow "Voces reales" graba.
import { mkdirSync, writeFileSync } from 'fs';
import { allLessons } from '../src/content';
import { audioKey } from '../src/lib/audioKey';
import type { LangCode } from '../src/types';

const extra: Record<LangCode, string> = { en: 'Hello! Nice to meet you.', no: 'Hei! Hyggelig å møte deg.' };

for (const lang of ['en', 'no'] as LangCode[]) {
  const texts = new Set<string>([extra[lang]]);
  for (const { lesson } of allLessons(lang)) {
    lesson.vocab.forEach((v) => {
      texts.add(v.term);
      if (v.example) texts.add(v.example);
    });
    lesson.sentences.forEach((s) => texts.add(s.text));
    lesson.dialog.lines.forEach((l) => texts.add(l.text));
    lesson.tip.examples.forEach((e) => texts.add(e.text));
  }
  const list = [...texts].map((text) => ({ key: audioKey(text), text: text.trim() }));
  mkdirSync(`audio/${lang}`, { recursive: true });
  writeFileSync(`audio/${lang}/manifest.json`, JSON.stringify(list, null, 1) + '\n');
  console.log(`${lang}: ${list.length} textos`);
}
