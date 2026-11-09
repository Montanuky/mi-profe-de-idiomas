// Audio con la voz del propio teléfono (gratis y sin conexión).
import * as Speech from 'expo-speech';

export function speak(text: string, language: string, slow = false) {
  Speech.stop();
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
  const run = (i: number) => {
    if (i >= texts.length) return;
    Speech.speak(texts[i], { language, rate: slow ? 0.55 : 0.9, onDone: () => {
        setTimeout(() => run(i + 1), 400);
      } });
  };
  run(0);
}
