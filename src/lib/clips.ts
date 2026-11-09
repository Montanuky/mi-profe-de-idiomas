// Reproduce las grabaciones con voz noruega real incluidas en la app.
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { audioNo } from '../content/audioNo';
import { audioKey } from './audioKey';

let player: AudioPlayer | null = null;
let sub: { remove(): void } | null = null;
let modeSet = false;

/** Devuelve la grabación de ese texto si existe (solo noruego). */
export function clipFor(text: string, language: string, slow: boolean): number | null {
  if (!language.toLowerCase().startsWith('nb')) return null;
  const c = audioNo[audioKey(text)];
  return c ? (slow ? c.slow : c.normal) : null;
}

export function hasNorwegianClips(): boolean {
  return Object.keys(audioNo).length > 0;
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
