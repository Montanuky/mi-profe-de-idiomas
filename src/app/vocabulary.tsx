// Vocabulario aprendido, con búsqueda, audio y estado de memorización.
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SpeakButton, T } from '../components/ui';
import { courses, findItem } from '../content';
import { cardStatus, CardStatus } from '../lib/srs';
import { useStore } from '../state/store';
import { useColors } from '../theme';
import type { VocabItem } from '../types';

const STATUS_LABEL: Record<CardStatus, string> = {
  nueva: 'Nueva',
  aprendiendo: 'Aprendiendo',
  conocida: 'Conocida',
  dominada: 'Dominada',
  difícil: 'Difícil',
};

export default function Vocabulary() {
  const c = useColors();
  const { data } = useStore();
  const lang = data.activeLang;
  const [q, setQ] = useState('');
  const colorOf: Record<CardStatus, string> = { nueva: c.textMuted, aprendiendo: c.primary, conocida: c.success, dominada: c.success, difícil: c.danger };

  const items = useMemo(() => {
    const out: { item: VocabItem; status: CardStatus }[] = [];
    Object.values(data.langs[lang].cards).forEach((card) => {
      const ref = findItem(card.id);
      if (ref?.kind === 'vocab') out.push({ item: ref.item, status: cardStatus(card) });
    });
    const query = q.trim().toLowerCase();
    return out
      .filter(({ item }) => !query || item.term.toLowerCase().includes(query) || item.es.toLowerCase().includes(query))
      .sort((a, b) => a.item.term.localeCompare(b.item.term));
  }, [data, lang, q]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: 16, gap: 8 }}>
        <T muted size={14}>
          {courses[lang].flag} {courses[lang].name} · {items.length} palabras
        </T>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Buscar en español o en el idioma…"
          placeholderTextColor={c.textMuted}
          autoCapitalize="none"
          style={{ backgroundColor: c.card, color: c.text, borderColor: c.border, borderWidth: 1, borderRadius: 14, padding: 12, fontSize: 16 }}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(x) => x.item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 8, paddingBottom: 40 }}
        ListEmptyComponent={<T muted center>{q ? 'No hay resultados.' : 'Aún no has aprendido palabras. ¡Empieza tu primera lección!'}</T>}
        renderItem={({ item: { item, status } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: c.border }}>
            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <T weight="700">{item.term}</T>
              <T size={14} muted>
                {item.es}
              </T>
            </View>
            <T size={12} weight="700" style={{ color: colorOf[status] }}>
              {STATUS_LABEL[status]}
            </T>
            <SpeakButton text={item.term} lang={lang} size={36} />
          </View>
        )}
      />
    </View>
  );
}
