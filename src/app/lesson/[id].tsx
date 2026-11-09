import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ResultView } from '../../components/ResultView';
import { SessionRunner } from '../../components/SessionRunner';
import { Button, Screen, T } from '../../components/ui';
import { findLesson, isLessonUnlocked, nextStep } from '../../content';
import { buildLessonSteps } from '../../lib/exercises';
import type { Answer } from '../../state/store';
import { useStore } from '../../state/store';

const PASS = 0.8;

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, finishSession, addTime } = useStore();
  const ref = findLesson(id);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ answers: Answer[]; score: number; passed: boolean } | null>(null);

  const steps = useMemo(
    () => (ref ? buildLessonSteps(ref.lang, ref.lesson, data.langs[ref.lang], data.profile?.dailyMinutes ?? 15) : []),
    // Se generan una vez por intento
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, attempt],
  );

  if (!ref || !isLessonUnlocked(ref.lang, ref.lesson.id, data.langs[ref.lang]))
    return (
      <Screen>
        <T>Esta lección todavía no está disponible.</T>
        <Button title="Volver" onPress={() => router.back()} />
      </Screen>
    );

  if (result) {
    const nxt = nextStep(ref.lang, data.langs[ref.lang]);
    return (
      <ResultView
        emoji={result.passed ? '🎉' : '💪'}
        title={result.passed ? '¡Lección superada!' : 'Casi lo tienes'}
        message={
          result.passed
            ? 'Las palabras nuevas ya están en tu sistema de repaso.'
            : 'Necesitas un 80 % en el test final para avanzar. Repite la lección: los ejercicios cambian cada vez.'
        }
        answers={result.answers}
        score={result.score}
        passed={result.passed}
        actions={[
          ...(result.passed && nxt.type === 'lesson'
            ? [{ title: `Siguiente: ${nxt.ref.lesson.title}`, onPress: () => router.replace(`/lesson/${nxt.ref.lesson.id}`) }]
            : result.passed && nxt.type === 'exam'
              ? [{ title: 'Hacer el examen de la unidad', onPress: () => router.replace(`/exam/${nxt.unit.id}`) }]
              : []),
          ...(!result.passed
            ? [
                {
                  title: 'Repetir la lección',
                  onPress: () => {
                    setResult(null);
                    setAttempt((a) => a + 1);
                  },
                },
              ]
            : []),
          { title: 'Volver al inicio', variant: 'secondary' as const, onPress: () => router.back() },
        ]}
      />
    );
  }

  return (
    <SessionRunner
      key={attempt}
      lang={ref.lang}
      steps={steps}
      onExit={(s) => {
        addTime(s);
        router.back();
      }}
      onFinish={(answers, seconds) => {
        const graded = answers.filter((a) => a.ex.graded);
        const score = graded.length ? graded.filter((a) => a.correct).length / graded.length : 1;
        const passed = score >= PASS;
        finishSession({ lang: ref.lang, kind: 'lesson', refId: ref.lesson.id, answers, seconds, score, passed });
        setResult({ answers, score, passed });
      }}
    />
  );
}
