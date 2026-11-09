// Reproduce las grabaciones con voces reales incluidas en la app (inglés y noruego).
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { audioEn } from '../content/audioEn';
import { audioNo } from '../content/audioNo';
import { audioKey } from './audioKey';

let player: AudioPlayer | null = null;
let sub: { remove(): void } | null = null;
let modeSet = false;

/** Devuelve la grabación de ese texto si existe. */
export function clipFor(text: string, language: string, slow: boolean): number | null {
  const l = language.toLowerCase();
  const map = l.startsWith('nb') ? audioNo : l.startsWith('en') ? audioEn : null;
  const c = map?.[audioKey(text)];
  return c ? (slow ? c.slow : c.normal) : null;
}

export function hasClips(language: string): boolean {
  return Object.keys(language.toLowerCase().startsWith('nb') ? audioNo : audioEn).length > 0;
}

export function stopClip() {
  sub?.remove();
  sub = null;
  try {
    player?.pause();
  } catch {}
}

export function playClip(source: number, onEnd?: () => void) {
  stopClip();
  if (!modeSet) {
    modeSet = true;
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }
  try {
    if (!player) player = createAudioPlayer(source);
    else player.replace(source);
    sub = player.addListener('playbackStatusUpdate', (s) => {
      if (s.didJustFinish) {
        sub?.remove();
        sub = null;
        onEnd?.();
      }
    });
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    onEnd?.();
  }
}
