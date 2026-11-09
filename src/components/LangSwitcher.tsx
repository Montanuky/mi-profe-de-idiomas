import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { courses, LANGS } from '../content';
import { langStats } from '../lib/stats';
import { useStore } from '../state/store';
import { langColor, useColors } from '../theme';
import { ProgressBar, T } from './ui';

/** Selector entre inglés y noruego con el progreso de cada uno. */
export function LangSwitcher() {
  const c = useColors();
  const { data, setActiveLang } = useStore();
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {LANGS.map((l) => {
        const active = data.activeLang === l;
        const st = langStats(data, l);
        const col = langColor(c, l);
        return (
          <Pressable
            key={l}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => setActiveLang(l)}
            style={{ flex: 1, backgroundColor: c.card, borderRadius: 18, padding: 14, gap: 8, borderWidth: 2, borderColor: active ? col : c.border }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 26 }}>{courses[l].flag}</Text>
              <T weight="800" size={16} style={{ color: active ? col : c.text }}>
                {courses[l].name}
              </T>
            </View>
            <ProgressBar value={st.completion} color={col} height={6} />
            <T size={12} muted>
              {Math.round(st.completion * 100)} % del A1 · {st.learned} palabras
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}
