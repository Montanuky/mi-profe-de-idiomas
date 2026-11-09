// Pantalla principal: progreso, objetivo diario y recomendación adaptativa.
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { LangSwitcher } from '../../components/LangSwitcher';
import { Button, Card, H1, ProgressBar, Row, Stat, T, Screen } from '../../components/ui';
import { courses, nextStep } from '../../content';
import { SKILL_NAMES, weakestSkill } from '../../lib/exercises';
import { globalStats, langStats } from '../../lib/stats';
import { useStore } from '../../state/store';
import { langColor, useColors } from '../../theme';

const SKILL_ADVICE = {
  vocab: 'Te cuesta recordar algunas palabras: tus lecciones incluirán más ejercicios de vocabulario y más repasos.',
  listening: 'La comprensión auditiva es tu punto débil: añadiré más ejercicios de escucha. Usa el botón 🐢 para oír más despacio.',
  writing: 'Escribir te cuesta más: añadiré más ejercicios de escritura para fijar la ortografía.',
  grammar: 'Las frases y el orden de las palabras te cuestan: añadiré más ejercicios de construir frases.',
} as const;

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

export default function Home() {
  const c = useColors();
  const { data } = useStore();
  const lang = data.activeLang;
  const course = courses[lang];
  const p = data.langs[lang];
  const st = langStats(data, lang);
  const g = globalStats(data);
  const next = nextStep(lang, p);
  const weak = weakestSkill(p);
  const col = langColor(c, lang);
  const minutesToday = Math.floor(g.todaySeconds / 60);

  // Recomendación: primero lo que se está olvidando, después avanzar
  let rec: { title: string; body: string; action: string; go: () => void };
  if (!p.placementDone)
    rec = {
      title: `Empieza con el ${course.name.toLowerCase()}`,
      body: 'Haz una prueba de nivel corta para empezar en tu punto, o empieza desde cero.',
      action: 'Prueba de nivel',
      go: () => router.push('/placement'),
    };
  else if (st.due >= 8)
    rec = {
      title: `Tienes ${st.due} repasos pendientes`,
      body: 'Estás a punto de olvidar estas palabras. Repasarlas ahora es lo que más te ayudará hoy.',
      action: 'Repasar ahora',
      go: () => router.push({ pathname: '/review-session', params: { mode: 'due' } }),
    };
  else if (next.type === 'lesson')
    rec = {
      title: next.ref.lesson.title,
      body: `${next.ref.unit.emoji} ${next.ref.unit.title} · ${next.ref.lesson.goal}`,
      action: p.lessons[next.ref.lesson.id]?.attempts ? 'Repetir lección' : 'Empezar lección',
      go: () => router.push(`/lesson/${next.ref.lesson.id}`),
    };
  else if (next.type === 'exam')
    rec = {
      title: `Examen: ${next.unit.title}`,
      body: 'Has terminado las lecciones de esta unidad. Aprueba el examen (80 %) para desbloquear la siguiente.',
      action: 'Hacer el examen',
      go: () => router.push(`/exam/${next.unit.id}`),
    };
  else
    rec = {
      title: '¡Has completado todo el A1!',
      body: 'Sigue repasando para no olvidar nada. El nivel A2 llegará en la próxima versión.',
      action: 'Practicar repaso',
      go: () => router.push({ pathname: '/review-session', params: { mode: st.due ? 'due' : 'hard' } }),
    };

  return (
    <Screen>
      <View>
        <T muted>{greeting()},</T>
        <H1>{data.profile?.name} 👋</H1>
      </View>

      <Card>
        <Row>
          <Text style={{ fontSize: 34 }}>{g.goalProgress >= 1 ? '🏆' : '🎯'}</Text>
          <View style={{ flex: 1, gap: 6 }}>
            <T weight="700">
              Objetivo de hoy: {minutesToday} / {data.profile?.dailyMinutes} min
            </T>
            <ProgressBar value={g.goalProgress} color={g.goalProgress >= 1 ? c.success : c.primary} />
          </View>
        </Row>
        <T muted size={14}>
          {g.goalProgress >= 1 ? '¡Objetivo cumplido! Todo lo que hagas ahora es extra.' : g.streak > 0 ? `Llevas ${g.streak} ${g.streak === 1 ? 'día' : 'días'} seguidos. ¡No rompas la racha!` : 'Estudia hoy para empezar tu racha.'}
        </T>
      </Card>

      <LangSwitcher />

      <Card style={{ borderColor: col, borderWidth: 2 }}>
        <T size={12} weight="800" style={{ color: col, letterSpacing: 1 }}>
          RECOMENDADO PARA TI · {course.flag}
        </T>
        <T size={20} weight="800">
          {rec.title}
        </T>
        <T muted>{rec.body}</T>
        <Button title={rec.action} color={col} onPress={rec.go} />
        {p.placementDone && st.due > 0 && st.due < 8 ? (
          <Button title={`Repasar ${st.due} ${st.due === 1 ? 'tarjeta' : 'tarjetas'}`} variant="secondary" onPress={() => router.push({ pathname: '/review-session', params: { mode: 'due' } })} />
        ) : null}
      </Card>

      {weak ? (
        <Card style={{ backgroundColor: c.warningSoft, borderWidth: 0 }}>
          <T weight="800">🧠 Me he fijado en algo: {SKILL_NAMES[weak].toLowerCase()}</T>
          <T size={15}>{SKILL_ADVICE[weak]}</T>
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat emoji="🔥" value={g.streak} label="días de racha" />
        <Stat emoji="📖" value={st.learned} label="palabras" />
        <Stat emoji="⏳" value={st.due} label="por repasar" />
      </View>
    </Screen>
  );
}
