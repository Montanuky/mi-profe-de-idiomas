// Audio en la versión web: grabaciones en noruego si existen; si no, la voz del navegador.
import { clipFor, playClip, stopClip } from './clips';
// Elige una voz del idioma correcto y evita el fallo de Chrome en Android
// que se "traga" la frase si se cancela y se habla en el mismo instante.

const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

let voices: SpeechSynthesisVoice[] = [];
function loadVoices() {
  try {
    voices = synth?.getVoices() ?? [];
  } catch {
    voices = [];
  }
}
loadVoices();
try {
  synth?.addEventListener?.('voiceschanged', loadVoices);
} catch {}

function prefixes(language: string): string[] {
  const p = language.slice(0, 2).toLowerCase();
  return p === 'nb' || p === 'no' || p === 'nn' ? ['nb', 'no', 'nn'] : [p];
}

function pickVoice(language: string): SpeechSynthesisVoice | undefined {
  if (!voices.length) loadVoices();
  const exact = voices.find((v) => v.lang.replace('_', '-').toLowerCase() === language.toLowerCase());
  if (exact) return exact;
  const pre = prefixes(language);
  return voices.find((v) => pre.includes(v.lang.slice(0, 2).toLowerCase()));
}

function utter(text: string, language: string, slow: boolean, onEnd?: () => void) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = language;
  const v = pickVoice(language);
  if (v) u.voice = v;
  u.rate = slow ? 0.6 : 0.9;
  if (onEnd) u.onend = onEnd;
  return u;
}

export function speak(text: string, language: string, slow = false) {
  const clip = clipFor(text, language, slow);
  if (clip) {
    try {
      synth?.cancel();
    } catch {}
    return playClip(clip);
  }
  stopClip();
  if (!synth) return;
  try {
    const wasBusy = synth.speaking || synth.pending;
    if (wasBusy) synth.cancel();
    const go = () => {
      synth.resume();
      synth.speak(utter(text, language, slow));
    };
    if (wasBusy) setTimeout(go, 80);
    else go();
  } catch {}
}

export async function hasVoice(language: string): Promise<boolean | null> {
  if (!synth) return false;
  if (!voices.length) {
    loadVoices();
    if (!voices.length) await new Promise((r) => setTimeout(r, 800));
    loadVoices();
  }
  if (!voices.length) return null;
  return !!pickVoice(language);
}

export function speakSequence(texts: string[], language: string, slow = false) {
  stopClip();
  try {
    synth?.cancel();
    const run = (i: number) => {
      if (i >= texts.length) return;
      const next = () => setTimeout(() => run(i + 1), 400);
      const clip = clipFor(texts[i], language, slow);
      if (clip) playClip(clip, next);
      else synth?.speak(utter(texts[i], language, slow, next));
    };
    setTimeout(() => run(0), 80);
  } catch {}
}
