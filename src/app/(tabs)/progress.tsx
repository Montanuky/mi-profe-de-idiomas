// Estadísticas, calendario de estudio y habilidades.
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button, Card, H1, H2, ProgressBar, Stat, T, Screen } from '../../components/ui';
import { courses, LANGS } from '../../content';
import { MONTHS, toKey, todayKey, WEEKDAYS_SHORT } from '../../lib/date';
import { SKILL_NAMES } from '../../lib/exercises';
import { globalStats, langStats } from '../../lib/stats';
import { useStore } from '../../state/store';
import { langColor, useColors } from '../../theme';
import type { Skill } from '../../types';

function Calendar({ active, seconds }: { active: Set<string>; seconds: Record<string, number> }) {
  const c = useColors();
  const now = new Date();
  const [month, setMonth] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const first = new Date(month.y, month.m, 1);
  const offset = (first.getDay() + 6) % 7; // lunes primero
  const days = new Date(month.y, month.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const today = todayKey();
  const shift = (d: number) => setMonth(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));
  const studied = cells.filter((d) => d && active.has(toKey(new Date(month.y, month.m, d)))).length;

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => shift(-1)} hitSlop={12} accessibilityLabel="Mes anterior">
          <T size={22}>‹</T>
        </Pressable>
        <T weight="800" style={{ textTransform: 'capitalize' }}>
          {MONTHS[month.m]} {month.y}
        </T>
        <Pressable onPress={() => shift(1)} hitSlop={12} accessibilityLabel="Mes siguiente">
          <T size={22}>›</T>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {WEEKDAYS_SHORT.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: 'center' }}>
            <T size={12} muted weight="700">
              {d}
            </T>
          </View>
        ))}
      </View>
      {Array.from({ length: cells.length / 7 }, (_, w) => (
        <View key={w} style={{ flexDirection: 'row' }}>
          {cells.slice(w * 7, w * 7 + 7).map((d, i) => {
            const key = d ? toKey(new Date(month.y, month.m, d)) : '';
            const on = d && active.has(key);
            const isToday = key === today;
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', paddingVertical: 3 }}>
                {d ? (
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: on ? c.success : 'transparent',
                      borderWidth: isToday ? 2 : 0,
                      borderColor: c.primary,
                    }}
                  >
                    <Text style={{ color: on ? '#fff' : c.text, fontWeight: on ? '800' : '400', fontSize: 14 }}>{d}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
      <T size={13} muted center>
        {studied} {studied === 1 ? 'día' : 'días'} de estudio este mes · {Math.round(Object.entries(seconds).filter(([k]) => k.startsWith(`${month.y}-${String(month.m + 1).padStart(2, '0')}`)).reduce((n, [, s]) => n + s, 0) / 60)} min
      </T>
    </Card>
  );
}

export default function ProgressScreen() {
  const c = useColors();
  const { data } = useStore();
  const g = globalStats(data);
  const seconds = Object.fromEntries(Object.entries(data.activity).map(([k, a]) => [k, a.seconds]));

  return (
    <Screen>
      <H1>Tu progreso</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat emoji="🔥" value={g.streak} label="días de racha" />
        <Stat emoji="⏱️" value={g.totalMinutes} label="minutos en total" />
        <Stat emoji="📅" value={g.activeDays.size} label="días estudiados" />
      </View>

      <H2>Calendario</H2>
      <Calendar active={g.activeDays} seconds={seconds} />

      {LANGS.map((l) => {
        const st = langStats(data, l);
        const p = data.langs[l];
        const col = langColor(c, l);
        return (
          <Card key={l}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 30 }}>{courses[l].flag}</Text>
              <T size={19} weight="800" style={{ flex: 1 }}>
                {courses[l].name}
              </T>
              <T size={19} weight="800" style={{ color: col }}>
                {Math.round(st.completion * 100)} %
              </T>
            </View>
            <ProgressBar value={st.completion} color={col} />
            <T size={13} muted>
              Nivel A1 completado · {st.lessonsPassed} lecciones superadas
            </T>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Mini label="Aprendidas" value={st.learned} />
              <Mini label="Conocidas" value={st.known} />
              <Mini label="Dominadas" value={st.mastered} />
              <Mini label="Difíciles" value={st.hard} />
            </View>
            <T weight="700" style={{ marginTop: 6 }}>
              Aciertos por habilidad
            </T>
            {(Object.keys(SKILL_NAMES) as Skill[]).map((s) => {
              const { correct, total } = p.skills[s];
              const rate = total ? correct / total : 0;
              return (
                <View key={s} style={{ gap: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <T size={14}>{SKILL_NAMES[s]}</T>
                    <T size={14} muted>
                      {total ? `${Math.round(rate * 100)} % (${total})` : 'sin datos'}
                    </T>
                  </View>
                  <ProgressBar value={rate} height={6} color={rate >= 0.85 ? c.success : rate >= 0.65 ? c.warning : c.danger} />
                </View>
              );
            })}
          </Card>
        );
      })}

      <View style={{ gap: 10 }}>
        <Button title="Vocabulario aprendido" icon="📖" variant="secondary" onPress={() => router.push('/vocabulary')} />
        <Button title="Historial de errores" icon="🧾" variant="secondary" onPress={() => router.push('/mistakes')} />
      </View>
    </Screen>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.cardAlt, borderRadius: 12, padding: 8, alignItems: 'center' }}>
      <T weight="800">{value}</T>
      <T size={11} muted>
        {label}
      </T>
    </View>
  );
}
