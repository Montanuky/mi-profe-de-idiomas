import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ResultView } from '../components/ResultView';
import { SessionRunner } from '../components/SessionRunner';
import { Button, Screen, T } from '../components/ui';
import { buildReviewSteps } from '../lib/exercises';
import type { Answer } from '../state/store';
import { useStore } from '../state/store';

export default function ReviewSession() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const m = mode === 'hard' ? 'hard' : 'due';
  const { data, finishSession, addTime } = useStore();
  const lang = data.activeLang;
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const steps = useMemo(() => buildReviewSteps(lang, data.langs[lang], data.profile?.dailyMinutes ?? 15, m), [lang, m, round]);

  if (answers)
    return (
      <ResultView
        emoji="✅"
        title="Repaso terminado"
        message={m === 'due' ? 'Lo que has acertado tardará más en volver; lo que has fallado volverá pronto.' : 'Buen trabajo reforzando tus puntos débiles.'}
        answers={answers}
        actions={[
          {
            title: 'Otra ronda',
            onPress: () => {
              setAnswers(null);
              setRound((r) => r + 1);
            },
          },
          { title: 'Volver', variant: 'secondary', onPress: () => router.back() },
        ]}
      />
    );

  if (!steps.length)
    return (
      <Screen>
        <T size={20} weight="800">
          ¡Nada que repasar ahora!
        </T>
        <T muted>{m === 'due' ? 'No tienes tarjetas pendientes. Vuelve mañana o haz una lección nueva.' : 'Todavía no has fallado nada que reforzar.'}</T>
        <Button title="Volver" onPress={() => router.back()} />
      </Screen>
    );

  return (
    <SessionRunner
      key={round}
      lang={lang}
      steps={steps}
      onExit={(s) => {
        addTime(s);
        router.back();
      }}
      onFinish={(a, seconds) => {
        finishSession({ lang, kind: m === 'due' ? 'review' : 'practice', answers: a, seconds });
        setAnswers(a);
      }}
    />
  );
}
