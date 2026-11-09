// Centro de repaso: repetición espaciada y práctica de lo que más cuesta.
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { LangSwitcher } from '../../components/LangSwitcher';
import { Button, Card, H1, Stat, T, Screen } from '../../components/ui';
import { courses } from '../../content';
import { addDays, todayKey } from '../../lib/date';
import { langStats } from '../../lib/stats';
import { useStore } from '../../state/store';
import { langColor, useColors } from '../../theme';

export default function ReviewScreen() {
  const c = useColors();
  const { data } = useStore();
  const lang = data.activeLang;
  const p = data.langs[lang];
  const st = langStats(data, lang);
  const col = langColor(c, lang);
  const cards = Object.values(p.cards);
  const tomorrow = addDays(todayKey(), 1);
  const dueTomorrow = cards.filter((x) => x.due === tomorrow).length;
  const hasHard = cards.some((x) => x.wrong > 0);

  return (
    <Screen>
      <H1>Repaso</H1>
      <LangSwitcher />
      <Card style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 50 }}>{st.due ? '🧠' : '✅'}</Text>
        <T size={22} weight="800" center>
          {st.due ? `${st.due} ${st.due === 1 ? 'tarjeta' : 'tarjetas'} para hoy` : 'Estás al día'}
        </T>
        <T muted center size={15}>
          {st.due
            ? 'Son las palabras y frases que estás a punto de olvidar. Si fallas una, volverá a salir pronto; si aciertas, tardará más en volver.'
            : cards.length
              ? `No te toca repasar nada más hoy. Mañana tendrás ${dueTomorrow} ${dueTomorrow === 1 ? 'tarjeta' : 'tarjetas'}.`
              : `Aún no tienes tarjetas de ${courses[lang].name.toLowerCase()}. Completa tu primera lección para empezar.`}
        </T>
        {st.due ? (
          <Button title="Empezar repaso" color={col} onPress={() => router.push({ pathname: '/review-session', params: { mode: 'due' } })} style={{ alignSelf: 'stretch' }} />
        ) : null}
      </Card>

      {hasHard ? (
        <Card>
          <T weight="800">💪 Practicar lo que más me cuesta</T>
          <T muted size={14}>
            Una sesión con las palabras y frases que más has fallado, para reforzarlas.
          </T>
          <Button title="Practicar puntos débiles" variant="secondary" onPress={() => router.push({ pathname: '/review-session', params: { mode: 'hard' } })} />
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat emoji="📖" value={st.learned} label="aprendidas" />
        <Stat emoji="⭐" value={st.known} label="conocidas" />
        <Stat emoji="⚠️" value={st.hard} label="difíciles" />
      </View>

      <View style={{ gap: 10 }}>
        <Button title="Ver vocabulario aprendido" icon="📖" variant="secondary" onPress={() => router.push('/vocabulary')} />
        <Button title="Ver historial de errores" icon="🧾" variant="secondary" onPress={() => router.push('/mistakes')} />
      </View>
    </Screen>
  );
}
