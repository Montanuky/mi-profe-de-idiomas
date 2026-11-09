import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { ResultView } from '../../components/ResultView';
import { SessionRunner } from '../../components/SessionRunner';
import { Button, Card, Screen, T } from '../../components/ui';
import { findUnit, isExamUnlocked, nextStep } from '../../content';
import { buildExamSteps, EXAM_PASS } from '../../lib/exercises';
import type { Answer } from '../../state/store';
import { useStore } from '../../state/store';

export default function ExamScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const { data, finishSession, addTime } = useStore();
  const ref = findUnit(unitId);
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ answers: Answer[]; score: number; passed: boolean } | null>(null);
  const steps = useMemo(() => (ref ? buildExamSteps(ref.lang, ref.unit) : []), [unitId, attempt]);

  if (!ref || !isExamUnlocked(ref.unit, data.langs[ref.lang]))
    return (
      <Screen>
        <T>Este examen todavía no está disponible. Completa antes todas las lecciones de la unidad.</T>
        <Button title="Volver" onPress={() => router.back()} />
      </Screen>
    );

  if (!started)
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 40 }}>
          <Text style={{ fontSize: 72 }}>📝</Text>
          <T size={26} weight="800" center>
            Examen: {ref.unit.title}
          </T>
          <T muted center>
            {steps.length} preguntas de toda la unidad: vocabulario, escucha, escritura y frases. Necesitas un {Math.round(EXAM_PASS * 100)} % para desbloquear la siguiente unidad.
          </T>
        </View>
        <Card style={{ gap: 6 }}>
          <T>• No hay segundas oportunidades dentro del examen.</T>
          <T>• Si no apruebas, repasa y vuelve a intentarlo cuando quieras.</T>
        </Card>
        <Button title="Empezar el examen" onPress={() => setStarted(true)} />
        <Button title="Ahora no" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );

  if (result) {
    const nxt = nextStep(ref.lang, data.langs[ref.lang]);
    return (
      <ResultView
        emoji={result.passed ? '🏅' : '📚'}
        title={result.passed ? '¡Examen aprobado!' : 'Todavía no'}
        message={result.passed ? 'Has desbloqueado la siguiente unidad.' : `Necesitas un ${Math.round(EXAM_PASS * 100)} %. Repasa tus errores y vuelve a intentarlo.`}
        answers={result.answers}
        score={result.score}
        passed={result.passed}
        actions={[
          ...(result.passed && nxt.type === 'lesson' ? [{ title: `Empezar: ${nxt.ref.lesson.title}`, onPress: () => router.replace(`/lesson/${nxt.ref.lesson.id}`) }] : []),
          ...(!result.passed
            ? [
                {
                  title: 'Intentarlo de nuevo',
                  onPress: () => {
                    setResult(null);
                    setAttempt((a) => a + 1);
                  },
                },
              ]
            : []),
          { title: 'Volver', variant: 'secondary' as const, onPress: () => router.back() },
        ]}
      />
    );
  }

  return (
    <SessionRunner
      key={attempt}
      lang={ref.lang}
      steps={steps}
      retryMistakes={false}
      onExit={(s) => {
        addTime(s);
        router.back();
      }}
      onFinish={(answers, seconds) => {
        const score = answers.filter((a) => a.correct).length / Math.max(1, answers.length);
        const passed = score >= EXAM_PASS;
        finishSession({ lang: ref.lang, kind: 'exam', refId: ref.unit.id, answers, seconds, score, passed });
        setResult({ answers, score, passed });
      }}
    />
  );
}
