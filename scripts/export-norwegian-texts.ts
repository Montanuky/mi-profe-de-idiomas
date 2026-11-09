// Lista todos los textos en noruego que la app puede leer en voz alta: npx tsx scripts/export-norwegian-texts.ts
import { writeFileSync } from 'fs';
import { allLessons } from '../src/content';
import { audioKey } from '../src/lib/audioKey';

const texts = new Set<string>(['Hei! Hyggelig å møte deg.']);
for (const { lesson } of allLessons('no')) {
  lesson.vocab.forEach((v) => {
    texts.add(v.term);
    if (v.example) texts.add(v.example);
  });
  lesson.sentences.forEach((s) => texts.add(s.text));
  lesson.dialog.lines.forEach((l) => texts.add(l.text));
  lesson.tip.examples.forEach((e) => texts.add(e.text));
}
const list = [...texts].map((text) => ({ key: audioKey(text), text: text.trim() }));
writeFileSync('audio/no/manifest.json', JSON.stringify(list, null, 1) + '\n');
console.log(`${list.length} textos en noruego`);
