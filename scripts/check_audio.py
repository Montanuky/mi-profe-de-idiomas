"""Escucha los audios grabados con un reconocedor de voz (Whisper) y comprueba
que dicen el texto esperado. Uso: python scripts/check_audio.py
Muestra un informe con los audios dudosos (parecido < 0.75)."""
import difflib
import json
import re
import unicodedata

from faster_whisper import WhisperModel

model = WhisperModel('small', device='cpu', compute_type='int8')


def norm(s: str) -> str:
    s = unicodedata.normalize('NFC', s.lower())
    s = re.sub(r"[^\w\såæø']", ' ', s)
    return ' '.join(s.split())


report = []
for lang, wlang in (('en', 'en'), ('no', 'no')):
    items = json.load(open(f'audio/{lang}/manifest.json', encoding='utf-8'))
    bad = 0
    for it in items:
        segs, _ = model.transcribe(f"assets/audio/{lang}/{it['key']}.mp3", language=wlang, beam_size=5,
                                   initial_prompt=None, condition_on_previous_text=False)
        heard = ' '.join(s.text for s in segs).strip()
        ratio = difflib.SequenceMatcher(None, norm(it['text']), norm(heard)).ratio()
        ok = ratio >= 0.75
        if not ok:
            bad += 1
        print(f"{'OK ' if ok else 'BAD'} {lang} {ratio:.2f} | {it['text']} | {heard}", flush=True)
        report.append({'lang': lang, 'text': it['text'], 'heard': heard, 'ratio': round(ratio, 2)})
    print(f'== {lang}: {len(items) - bad}/{len(items)} coinciden', flush=True)
json.dump(report, open('audio-check.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
