// Prueba inicial de nivel: avanza unidad por unidad y se detiene en la primera que no dominas.
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SessionRunner } from '../components/SessionRunner';
import { Button, Card, Screen, T } from '../components/ui';
import { allUnits, courses } from '../content';
import { buildPlacementBlock } from '../lib/exercises';
import type { Answer } from '../state/store';
import { useStore } from '../state/store';

export default function Placement() {
  const { data, applyPlacement, finishSession, addTime } = useStore();
  const lang = data.activeLang;
  const course = courses[lang];
  const units = allUnits(lang);
  const [phase, setPhase] = useState<'intro' | 'test' | 'done'>('intro');
  const [unitIndex, setUnitIndex] = useState(0);
  const [passed, setPassed] = useState(0);
  const all = useRef<Answer[]>([]);
  const secs = useRef(0);
  const steps = useMemo(() => buildPlacementBlock(lang, unitIndex), [lang, unitIndex]);

  const finish = (unitsPassed: number) => {
    applyPlacement(lang, unitsPassed);
    finishSession({ lang, kind: 'placement', answers: all.current, seconds: secs.current });
    setPassed(unitsPassed);
    setPhase('done');
  };

  if (phase === 'intro')
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 40 }}>
          <Text style={{ fontSize: 72 }}>{course.flag}</Text>
          <T size={26} weight="800" center>
            Prueba de nivel de {course.name.toLowerCase()}
          </T>
          <T muted center>
            Te haré 4 preguntas de cada unidad. Si aciertas al menos 3, la daré por sabida y pasaremos a la siguiente. En cuanto encuentre lo que aún no sabes, paramos: ahí empezarás.
          </T>
        </View>
        <Card>
          <T>Si no sabes una respuesta, no pasa nada: en las preguntas de escribir pulsa "No lo sé" y en las demás elige la opción que te parezca. Es mejor ser sincero para empezar en el punto justo.</T>
        </Card>
        <Button title="Empezar la prueba" onPress={() => setPhase('test')} />
        <Button
          title="No sé nada, empezar desde cero"
          variant="secondary"
          onPress={() => {
            applyPlacement(lang, 0);
            router.back();
          }}
        />
      </Screen>
    );

  if (phase === 'done') {
    const start = units[passed];
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 40 }}>
          <Text style={{ fontSize: 72 }}>{passed ? '🚀' : '🌱'}</Text>
          <T size={26} weight="800" center>
            {passed === units.length ? '¡Dominas todo el A1!' : passed ? `Ya sabes ${passed} ${passed === 1 ? 'unidad' : 'unidades'}` : 'Empezamos desde el principio'}
          </T>
          <T muted center>
            {passed === units.length
              ? 'Has superado todas las unidades disponibles. Repasa con el sistema de repaso mientras preparo el nivel A2.'
              : passed
                ? `Empezarás en la unidad ${passed + 1}: ${start.title}. Las palabras de las unidades superadas entran en tus repasos para confirmar que no las olvidas.`
                : `Empezarás por la unidad 1: ${start.title}. ¡Es el mejor punto de partida!`}
          </T>
        </View>
        <Button title="Ir al curso" onPress={() => router.replace('/(tabs)/course')} />
      </Screen>
    );
  }

  return (
    <SessionRunner
      key={unitIndex}
      lang={lang}
      steps={steps}
      retryMistakes={false}
      onExit={(s) => {
        addTime(s);
        router.back();
      }}
      onFinish={(answers, seconds) => {
        all.current.push(...answers);
        secs.current += seconds;
        const ok = answers.filter((a) => a.correct).length >= 3;
        if (ok && unitIndex + 1 < units.length) setUnitIndex(unitIndex + 1);
        else finish(ok ? unitIndex + 1 : unitIndex);
      }}
    />
  );
}
