// Ejecuta una sesión (lección, repaso, examen o prueba de nivel) paso a paso.
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { courses } from '../content';
import type { Step } from '../lib/exercises';
import { speak, speakSequence } from '../lib/speech';
import type { Answer } from '../state/store';
import { useStore } from '../state/store';
import { useColors } from '../theme';
import type { DialogLine, LangCode, Tip, VocabItem } from '../types';
import { ExerciseView } from './ExerciseView';
import { Button, Card, ProgressBar, SpeakButton, T } from './ui';

interface Props {
  lang: LangCode;
  steps: Step[];
  onFinish: (answers: Answer[], seconds: number) => void;
  onExit: (seconds: number) => void;
  /** Repetir los ejercicios fallados (no se aplica a los evaluados). */
  retryMistakes?: boolean;
}

const MAX_RETRIES = 3;

export function SessionRunner({ lang, steps: initial, onFinish, onExit, retryMistakes = true }: Props) {
  const c = useColors();
  const [queue, setQueue] = useState<Step[]>(initial);
  const [index, setIndex] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);
  const answers = useRef<Answer[]>([]);
  const retries = useRef<Record<string, number>>({});
  const retryOf = useRef<Record<string, string>>({}); // clave de reintento → clave original
  const start = useRef(Date.now());
  const seconds = () => Math.round((Date.now() - start.current) / 1000);

  const step = queue[index];
  const next = (q = queue) => {
    if (index + 1 >= q.length) onFinish(answers.current, seconds());
    else setIndex(index + 1);
  };

  const onAnswer = (correct: boolean, given: string) => {
    if (step.type !== 'exercise') return;
    const ex = step.ex;
    const origin = retryOf.current[ex.key] ?? ex.key;
    const isRetry = origin !== ex.key;
    answers.current.push({ ex, correct, given, retry: isRetry });
    let q = queue;
    if (!correct && retryMistakes && !ex.graded) {
      const n = retries.current[origin] ?? 0;
      if (n < MAX_RETRIES) {
        retries.current[origin] = n + 1;
        const copy = { ...ex, key: `${origin}-r${n + 1}` };
        retryOf.current[copy.key] = origin;
        const pos = Math.min(index + 3, queue.length);
        // Los reintentos van antes del test final si lo hay
        const testStart = queue.findIndex((s, i) => i > index && s.type === 'exercise' && s.ex.graded);
        const at = testStart > 0 ? Math.min(pos, testStart) : pos;
        q = [...queue.slice(0, at), { type: 'exercise', ex: copy }, ...queue.slice(at)];
        setQueue(q);
      }
    }
    next(q);
  };

  if (!step) return null;
  const progress = index / queue.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <Pressable accessibilityLabel="Salir" onPress={() => setConfirmExit(true)} hitSlop={12}>
          <Text style={{ fontSize: 22, color: c.textMuted }}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressBar value={progress} />
        </View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {step.type === 'exercise' ? (
            <ExerciseView key={step.ex.key} ex={step.ex} lang={lang} onDone={onAnswer} />
          ) : step.type === 'card' ? (
            <VocabCard key={step.item.id} item={step.item} lang={lang} onNext={() => next()} />
          ) : step.type === 'tip' ? (
            <TipView tip={step.tip} lang={lang} onNext={() => next()} />
          ) : step.type === 'dialog' ? (
            <DialogView title={step.title} lines={step.lines} lang={lang} onNext={() => next()} />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 }}>
              <Text style={{ fontSize: 64 }}>{step.emoji}</Text>
              <T size={26} weight="800" center>
                {step.title}
              </T>
              <T muted center size={17}>
                {step.subtitle}
              </T>
              <Button title="Empezar" onPress={() => next()} style={{ alignSelf: 'stretch', marginTop: 20 }} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {confirmExit ? (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 }}>
          <Card>
            <T size={19} weight="800">
              ¿Salir de la sesión?
            </T>
            <T muted>El tiempo estudiado se guarda, pero las respuestas de esta sesión no contarán.</T>
            <Button title="Seguir estudiando" onPress={() => setConfirmExit(false)} />
            <Button title="Salir" variant="danger" onPress={() => onExit(seconds())} />
          </Card>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function VocabCard({ item, lang, onNext }: { item: VocabItem; lang: LangCode; onNext: () => void }) {
  const c = useColors();
  const { data } = useStore();
  useEffect(() => {
    const t = setTimeout(() => speak(item.term, courses[lang].speechLang, data.profile?.slowAudio), 300);
    return () => clearTimeout(t);
  }, [item.id]);
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Text style={{ color: c.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1 }}>PALABRA NUEVA</Text>
      <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
        <Text style={{ fontSize: 80 }}>{item.emoji}</Text>
        <T size={30} weight="800" center>
          {item.term}
        </T>
        <T size={19} muted center>
          {item.es}
        </T>
        <SpeakButton text={item.term} lang={lang} size={56} slowToggle />
      </Card>
      {item.note ? (
        <View style={{ backgroundColor: c.warningSoft, borderRadius: 16, padding: 14 }}>
          <T size={15}>💡 {item.note}</T>
        </View>
      ) : null}
      {item.example ? (
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <T weight="700">{item.example}</T>
            <T muted size={14}>
              {item.exampleEs}
            </T>
          </View>
          <SpeakButton text={item.example} lang={lang} size={38} />
        </Card>
      ) : null}
      <View style={{ flex: 1 }} />
      <Button title="Entendido" onPress={onNext} />
    </View>
  );
}

function TipView({ tip, lang, onNext }: { tip: Tip; lang: LangCode; onNext: () => void }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, gap: 16 }}>
      <Text style={{ color: c.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1 }}>EXPLICACIÓN</Text>
      <T size={24} weight="800">
        {tip.title}
      </T>
      <Card>
        <T size={17}>{tip.body}</T>
      </Card>
      {tip.examples.map((e) => (
        <Card key={e.text} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <T weight="700">{e.text}</T>
            <T muted size={14}>
              {e.es}
            </T>
          </View>
          <SpeakButton text={e.text} lang={lang} size={38} />
        </Card>
      ))}
      <View style={{ flex: 1 }} />
      <Button title="Continuar" onPress={onNext} />
    </View>
  );
}

function DialogView({ title, lines, lang, onNext }: { title: string; lines: DialogLine[]; lang: LangCode; onNext: () => void }) {
  const c = useColors();
  const { data } = useStore();
  const [showEs, setShowEs] = useState(false);
  const playAll = () => speakSequence(lines.map((l) => l.text), courses[lang].speechLang, data.profile?.slowAudio);
  return (
    <View style={{ flex: 1, gap: 14 }}>
      <Text style={{ color: c.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1 }}>CONVERSACIÓN</Text>
      <T size={22} weight="800">
        {title}
      </T>
      {lines.map((l, i) => (
        <View
          key={i}
          style={{
            alignSelf: l.speaker === 'A' ? 'flex-start' : 'flex-end',
            maxWidth: '88%',
            backgroundColor: l.speaker === 'A' ? c.card : c.primarySoft,
            borderColor: c.border,
            borderWidth: l.speaker === 'A' ? 1 : 0,
            borderRadius: 18,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <T weight="600">{l.text}</T>
            {showEs ? (
              <T size={14} muted>
                {l.es}
              </T>
            ) : null}
          </View>
          <SpeakButton text={l.text} lang={lang} size={34} />
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Escuchar todo" icon="▶️" variant="secondary" onPress={playAll} style={{ flex: 1 }} />
        <Button title={showEs ? 'Ocultar' : 'Traducir'} icon="🇪🇸" variant="secondary" onPress={() => setShowEs((s) => !s)} style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 1 }} />
      <Button title="Continuar" onPress={onNext} />
    </View>
  );
}
