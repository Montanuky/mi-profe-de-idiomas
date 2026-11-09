// Audio: grabaciones con voz noruega real cuando existen; si no, la voz del teléfono.
import * as Speech from 'expo-speech';
import { clipFor, playClip, stopClip } from './clips';

export function speak(text: string, language: string, slow = false) {
  Speech.stop();
  const clip = clipFor(text, language, slow);
  if (clip) return playClip(clip);
  stopClip();
  Speech.speak(text, { language, rate: slow ? 0.55 : 0.9 });
}

/** Comprueba si el teléfono tiene una voz instalada para ese idioma. */
export async function hasVoice(language: string): Promise<boolean | null> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (!voices || voices.length === 0) return null; // no se puede saber
    const prefix = language.slice(0, 2).toLowerCase();
    const alt = prefix === 'nb' ? ['nb', 'no', 'nn'] : [prefix];
    return voices.some((v) => alt.includes(v.language.slice(0, 2).toLowerCase()));
  } catch {
    return null;
  }
}

/** Lee varias frases seguidas, esperando a que termine cada una. */
export function speakSequence(texts: string[], language: string, slow = false) {
  Speech.stop();
  stopClip();
  const run = (i: number) => {
    if (i >= texts.length) return;
    const next = () => {
      setTimeout(() => run(i + 1), 400);
    };
    const clip = clipFor(texts[i], language, slow);
    if (clip) playClip(clip, next);
    else Speech.speak(texts[i], { language, rate: slow ? 0.55 : 0.9, onDone: next });
  };
  run(0);
}
