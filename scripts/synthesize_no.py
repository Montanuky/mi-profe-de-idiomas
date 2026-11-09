"""Graba con voz noruega (Piper) todos los textos de audio/no/manifest.json.

Se ejecuta en GitHub Actions (workflow "Voz noruega"). Genera:
  assets/audio/no/<clave>.mp3 y <clave>-slow.mp3
  src/content/audioNo.ts (mapa clave -> archivo)
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

from piper import PiperVoice, SynthesisConfig

MODEL = sys.argv[1]
OUT = 'assets/audio/no'
os.makedirs(OUT, exist_ok=True)

voice = PiperVoice.load(MODEL)
items = json.load(open('audio/no/manifest.json', encoding='utf-8'))
keys = {i['key'] for i in items}

# Borra grabaciones de textos que ya no existen
for f in os.listdir(OUT):
    if f.endswith('.mp3') and f.split('.')[0].replace('-slow', '') not in keys:
        os.remove(os.path.join(OUT, f))

configs = {'': SynthesisConfig(length_scale=1.0), '-slow': SynthesisConfig(length_scale=1.6)}
for n, item in enumerate(items):
    for suffix, cfg in configs.items():
        mp3 = os.path.join(OUT, f"{item['key']}{suffix}.mp3")
        if os.path.exists(mp3):
            continue
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            path = tmp.name
        with wave.open(path, 'wb') as wf:
            voice.synthesize_wav(item['text'], wf, syn_config=cfg)
        subprocess.run(
            ['ffmpeg', '-loglevel', 'error', '-y', '-i', path, '-af', 'adelay=120,apad=pad_dur=0.15',
             '-ac', '1', '-ar', '22050', '-b:a', '48k', mp3],
            check=True,
        )
        os.remove(path)
    print(f"{n + 1}/{len(items)} {item['text']}")

lines = [
    '// Archivo generado automáticamente por scripts/synthesize_no.py. No editar a mano.',
    '// Grabaciones con voz noruega (Piper, voz "talesyntese"), normal y lenta.',
    'export const audioNo: Record<string, { normal: number; slow: number }> = {',
]
for item in sorted(items, key=lambda i: i['key']):
    k = item['key']
    lines.append(
        f"  '{k}': {{ normal: require('../../assets/audio/no/{k}.mp3'), slow: require('../../assets/audio/no/{k}-slow.mp3') }},"
    )
lines.append('};')
open('src/content/audioNo.ts', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('audioNo.ts actualizado')
