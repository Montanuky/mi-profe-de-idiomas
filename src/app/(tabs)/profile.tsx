// Perfil y ajustes: nombre, objetivo diario, tema, audio y reinicio.
import React, { useEffect, useState } from 'react';
import { Pressable, Switch, TextInput, View } from 'react-native';
import { Button, Card, Chip, H1, H2, T, Screen } from '../../components/ui';
import { courses, LANGS } from '../../content';
import { hasVoice, speak } from '../../lib/speech';
import { useStore } from '../../state/store';
import { useColors } from '../../theme';
import type { LangCode, Profile, ThemePref } from '../../types';

export default function ProfileScreen() {
  const c = useColors();
  const { data, updateProfile, resetLang, resetAll } = useStore();
  const profile = data.profile!;
  const [name, setName] = useState(profile.name);
  const [voices, setVoices] = useState<Record<LangCode, boolean | null>>({ en: null, no: null });
  const [confirm, setConfirm] = useState<null | LangCode | 'all'>(null);

  useEffect(() => {
    Promise.all(LANGS.map((l) => hasVoice(courses[l].speechLang))).then(([en, no]) => setVoices({ en, no }));
  }, []);

  return (
    <Screen>
      <H1>Perfil</H1>

      <Card>
        <T weight="700">Tu nombre</T>
        <TextInput
          value={name}
          onChangeText={setName}
          onBlur={() => name.trim() && updateProfile({ name: name.trim() })}
          onSubmitEditing={() => name.trim() && updateProfile({ name: name.trim() })}
          style={{ backgroundColor: c.cardAlt, color: c.text, borderRadius: 12, padding: 12, fontSize: 17 }}
        />
      </Card>

      <Card>
        <T weight="700">Objetivo diario</T>
        <T muted size={14}>
          También decide cuántos repasos entran en cada sesión.
        </T>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {([10, 15, 20, 30] as Profile['dailyMinutes'][]).map((m) => (
            <Chip key={m} label={`${m} min`} selected={profile.dailyMinutes === m} onPress={() => updateProfile({ dailyMinutes: m })} />
          ))}
        </View>
      </Card>

      <Card>
        <T weight="700">Apariencia</T>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(
            [
              ['system', 'Automático'],
              ['light', 'Claro ☀️'],
              ['dark', 'Oscuro 🌙'],
            ] as [ThemePref, string][]
          ).map(([v, label]) => (
            <Chip key={v} label={label} selected={profile.theme === v} onPress={() => updateProfile({ theme: v })} />
          ))}
        </View>
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <T weight="700">Audio más lento</T>
            <T muted size={14}>
              Todas las palabras y frases se leerán despacio.
            </T>
          </View>
          <Switch value={profile.slowAudio} onValueChange={(v) => updateProfile({ slowAudio: v })} trackColor={{ true: c.primary }} />
        </View>
        <H2>Voces del teléfono</H2>
        {LANGS.map((l) => (
          <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <T>
                {courses[l].flag} {courses[l].name}
              </T>
              <T size={13} muted>
                {voices[l] === false
                  ? 'No se ha encontrado voz instalada. Instálala en los ajustes del teléfono (Texto a voz / Contenido leído).'
                  : voices[l]
                    ? 'Voz instalada'
                    : 'Pulsa el botón para comprobar cómo suena'}
              </T>
            </View>
            <Pressable onPress={() => speak(l === 'en' ? 'Hello! Nice to meet you.' : 'Hei! Hyggelig å møte deg.', courses[l].speechLang)} style={{ backgroundColor: c.primarySoft, borderRadius: 12, padding: 10 }}>
              <T>🔊 Probar</T>
            </Pressable>
          </View>
        ))}
      </Card>

      <Card>
        <T weight="700">Reiniciar</T>
        {confirm ? (
          <>
            <T style={{ color: c.danger }}>
              {confirm === 'all' ? 'Se borrarán tu perfil y todo tu progreso. No se puede deshacer.' : `Se borrará todo tu progreso de ${courses[confirm].name.toLowerCase()}. No se puede deshacer.`}
            </T>
            <Button
              title="Sí, borrar"
              variant="danger"
              onPress={() => {
                if (confirm === 'all') resetAll();
                else resetLang(confirm);
                setConfirm(null);
              }}
            />
            <Button title="Cancelar" variant="secondary" onPress={() => setConfirm(null)} />
          </>
        ) : (
          <>
            {LANGS.map((l) => (
              <Button key={l} title={`Reiniciar ${courses[l].name.toLowerCase()}`} variant="secondary" onPress={() => setConfirm(l)} />
            ))}
            <Button title="Borrar todo" variant="danger" onPress={() => setConfirm('all')} />
          </>
        )}
      </Card>
      <T muted size={12} center>
        Tus datos se guardan solo en este teléfono.
      </T>
    </Screen>
  );
}
