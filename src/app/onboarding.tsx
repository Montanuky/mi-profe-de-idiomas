// Primera vez: crear el perfil personal y elegir idioma.
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button, Card, Chip, H1, Screen, T } from '../components/ui';
import { courses, LANGS } from '../content';
import { useStore } from '../state/store';
import { langColor, useColors } from '../theme';
import type { LangCode, Profile } from '../types';

const MINUTES: Profile['dailyMinutes'][] = [10, 15, 20, 30];

export default function Onboarding() {
  const c = useColors();
  const { saveProfile, setActiveLang, applyPlacement } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState<Profile['dailyMinutes']>(15);
  const [lang, setLang] = useState<LangCode>('en');

  const finish = (placement: boolean) => {
    saveProfile({ name: name.trim(), dailyMinutes: minutes, createdAt: new Date().toISOString(), theme: 'system', slowAudio: false });
    setActiveLang(lang);
    if (!placement) applyPlacement(lang, 0);
    router.replace('/(tabs)');
    if (placement) router.push('/placement');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= step ? c.primary : c.cardAlt }} />
        ))}
      </View>

      {step === 0 ? (
        <View style={{ gap: 16, paddingTop: 30 }}>
          <Text style={{ fontSize: 72, textAlign: 'center' }}>🇬🇧 🇳🇴</Text>
          <H1>Tu profesor particular de inglés y noruego</H1>
          <T muted size={17}>
            Aprenderás desde cero con lecciones cortas, audio, ejercicios y un sistema de repaso que recuerda lo que te cuesta y te lo vuelve a preguntar justo antes de que lo olvides.
          </T>
          <Button title="Empezar" onPress={() => setStep(1)} />
        </View>
      ) : null}

      {step === 1 ? (
        <View style={{ gap: 16, paddingTop: 30 }}>
          <H1>¿Cómo te llamas?</H1>
          <T muted>Lo usaremos para saludarte.</T>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor={c.textMuted}
            autoFocus
            onSubmitEditing={() => name.trim() && setStep(2)}
            style={{ backgroundColor: c.card, color: c.text, borderColor: c.border, borderWidth: 2, borderRadius: 16, padding: 16, fontSize: 19 }}
          />
          <Button title="Siguiente" disabled={!name.trim()} onPress={() => setStep(2)} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={{ gap: 16, paddingTop: 30 }}>
          <H1>¿Cuánto tiempo al día?</H1>
          <T muted>Es tu objetivo diario. Podrás cambiarlo cuando quieras en tu perfil.</T>
          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            {MINUTES.map((m) => (
              <Chip key={m} label={`${m} min`} selected={minutes === m} onPress={() => setMinutes(m)} />
            ))}
          </View>
          <T muted size={14}>
            {minutes <= 10 ? 'Perfecto para crear el hábito.' : minutes <= 15 ? 'Un buen equilibrio para avanzar sin agobios.' : minutes <= 20 ? 'Avanzarás a buen ritmo.' : 'Modo intensivo: progreso rápido.'}
          </T>
          <Button title="Siguiente" onPress={() => setStep(3)} />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={{ gap: 16, paddingTop: 30 }}>
          <H1>¿Por qué idioma empiezas?</H1>
          <T muted>Puedes estudiar los dos; cada uno tiene su progreso independiente.</T>
          {LANGS.map((l) => (
            <Card key={l} onPress={() => setLang(l)} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: lang === l ? langColor(c, l) : c.border }}>
              <Text style={{ fontSize: 40 }}>{courses[l].flag}</Text>
              <View style={{ flex: 1 }}>
                <T size={19} weight="800">
                  {courses[l].name}
                </T>
                <T muted size={14}>
                  {courses[l].variant}
                </T>
              </View>
              {lang === l ? <Text style={{ fontSize: 22 }}>✅</Text> : null}
            </Card>
          ))}
          <T muted size={14}>
            ¿Ya sabes algo? Haz una prueba de nivel corta y empezarás en tu punto. Si no sabes nada, empieza desde cero.
          </T>
          <Button title="Hacer la prueba de nivel" onPress={() => finish(true)} />
          <Button title="Empezar desde cero" variant="secondary" onPress={() => finish(false)} />
        </View>
      ) : null}
    </Screen>
  );
}
