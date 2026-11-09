// Historial de errores con la explicación de cada uno.
import React from 'react';
import { FlatList, View } from 'react-native';
import { T } from '../components/ui';
import { courses } from '../content';
import { SKILL_NAMES } from '../lib/exercises';
import { useStore } from '../state/store';
import { useColors } from '../theme';

export default function Mistakes() {
  const c = useColors();
  const { data } = useStore();
  const lang = data.activeLang;
  const list = data.langs[lang].mistakes;

  // Errores que más se repiten
  const counts = new Map<string, number>();
  list.forEach((m) => counts.set(m.itemId, (counts.get(m.itemId) ?? 0) + 1));

  return (
    <FlatList
      style={{ backgroundColor: c.bg }}
      data={list}
      keyExtractor={(_, i) => String(i)}
      contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 40 }}
      ListHeaderComponent={
        <T muted size={14}>
          {courses[lang].flag} {courses[lang].name} · {list.length} errores guardados. Los que repites más salen marcados y aparecen más en tus repasos.
        </T>
      }
      ListEmptyComponent={<T muted center>Todavía no tienes errores. ¡Sigue así!</T>}
      renderItem={({ item: m }) => {
        const times = counts.get(m.itemId) ?? 1;
        return (
          <View style={{ backgroundColor: c.card, borderRadius: 16, padding: 14, gap: 4, borderWidth: 1, borderColor: times >= 3 ? c.danger : c.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={12} muted weight="700">
                {SKILL_NAMES[m.skill].toUpperCase()} · {new Date(m.date).toLocaleDateString('es-ES')}
              </T>
              {times >= 2 ? (
                <T size={12} weight="800" style={{ color: c.danger }}>
                  ×{times}
                </T>
              ) : null}
            </View>
            <T size={15} muted>
              {m.prompt}
            </T>
            {m.given ? (
              <T size={15} style={{ color: c.danger }}>
                ✗ {m.given}
              </T>
            ) : null}
            <T size={15} weight="700" style={{ color: c.success }}>
              ✓ {m.expected}
            </T>
            <T size={14}>💡 {m.explanation}</T>
          </View>
        );
      }}
    />
  );
}
