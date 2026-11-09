"""Graba con una voz real (Piper) todos los textos de audio/<idioma>/manifest.json.

Uso: python scripts/synthesize.py <idioma> <modelo.onnx> "<descripción de la voz>"
Se ejecuta en GitHub Actions (workflow "Voces reales"). Genera:
  assets/audio/<idioma>/<clave>.mp3 y <clave>-slow.mp3
  src/content/audio<Idioma>.ts (mapa clave -> archivo)
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

from piper import PiperVoice, SynthesisConfig

LANG = sys.argv[1]
MODEL = sys.argv[2]
VOICE = sys.argv[3]
NAME = 'audio' + LANG.capitalize()
OUT = f'assets/audio/{LANG}'
os.makedirs(OUT, exist_ok=True)

voice = PiperVoice.load(MODEL)
items = json.load(open(f'audio/{LANG}/manifest.json', encoding='utf-8'))
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
    f'// Grabaciones con voz real ({VOICE}), normal y lenta.',
    f'export const {NAME}: Record<string, {{ normal: number; slow: number }}> = {{',
]
for item in sorted(items, key=lambda i: i['key']):
    k = item['key']
    lines.append(
        f"  '{k}': {{ normal: require('../../assets/audio/{LANG}/{k}.mp3'), slow: require('../../assets/audio/{LANG}/{k}-slow.mp3') }},"
    )
lines.append('};')
open(f'src/content/{NAME}.ts', 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print(f'{NAME}.ts actualizado')
