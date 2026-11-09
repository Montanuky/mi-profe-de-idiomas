// Pantalla de resultados al terminar una sesión, con los errores explicados.
import React from 'react';
import { Text, View } from 'react-native';
import type { Answer } from '../state/store';
import { useColors } from '../theme';
import { Button, Card, Screen, T } from './ui';

interface Props {
  emoji: string;
  title: string;
  message: string;
  answers: Answer[];
  score?: number; // 0..1, solo si hay nota
  passed?: boolean;
  actions: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' }[];
}

export function ResultView({ emoji, title, message, answers, score, passed, actions }: Props) {
  const c = useColors();
  const firstTries = answers.filter((a) => !a.retry);
  const correct = firstTries.filter((a) => a.correct).length;
  const mistakes = answers.filter((a) => !a.correct && !a.retry);
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 8, paddingTop: 20 }}>
        <Text style={{ fontSize: 72 }}>{emoji}</Text>
        <T size={26} weight="800" center>
          {title}
        </T>
        <T muted center>
          {message}
        </T>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {score !== undefined ? (
          <Card style={{ flex: 1, alignItems: 'center', backgroundColor: passed ? c.successSoft : c.dangerSoft, borderWidth: 0 }}>
            <T size={28} weight="800" style={{ color: passed ? c.success : c.danger }}>
              {Math.round(score * 100)} %
            </T>
            <T size={13} muted>
              Nota
            </T>
          </Card>
        ) : null}
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <T size={28} weight="800">
            {correct}/{firstTries.length}
          </T>
          <T size={13} muted>
            Aciertos a la primera
          </T>
        </Card>
      </View>
      {mistakes.length ? (
        <View style={{ gap: 10 }}>
          <T size={18} weight="800">
            Para repasar
          </T>
          <T muted size={14}>
            Estos fallos se han guardado y volverán a salir en tus repasos.
          </T>
          {mistakes.map((m, i) => (
            <Card key={i} style={{ gap: 4 }}>
              <T size={14} muted>
                {m.ex.prompt ?? m.ex.speak ?? m.ex.instruction}
              </T>
              {m.given ? (
                <T size={15} style={{ color: c.danger }}>
                  ✗ {m.given}
                </T>
              ) : null}
              {m.ex.answer ? (
                <T size={15} weight="700" style={{ color: c.success }}>
                  ✓ {m.ex.answer}
                </T>
              ) : null}
              <T size={14}>💡 {m.ex.explanation}</T>
            </Card>
          ))}
        </View>
      ) : null}
      <View style={{ gap: 10, marginTop: 8 }}>
        {actions.map((a) => (
          <Button key={a.title} title={a.title} onPress={a.onPress} variant={a.variant} />
        ))}
      </View>
    </Screen>
  );
}
