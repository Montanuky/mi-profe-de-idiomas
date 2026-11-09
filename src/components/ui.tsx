// Componentes de interfaz reutilizables.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { courses } from '../content';
import { speak } from '../lib/speech';
import { useStore } from '../state/store';
import { useColors } from '../theme';
import type { LangCode } from '../types';

export function Screen({ children, scroll = true, padded = true }: { children: React.ReactNode; scroll?: boolean; padded?: boolean }) {
  const c = useColors();
  const inner = padded ? { padding: 20, paddingBottom: 40, gap: 16 } : undefined;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={inner} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, inner]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const c = useColors();
  const base: ViewStyle = { backgroundColor: c.card, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: c.border, gap: 10 };
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, style, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
        {children}
      </Pressable>
    );
  return <View style={[base, style]}>{children}</View>;
}

export function T({ children, style, muted, size = 16, weight, center }: { children: React.ReactNode; style?: TextStyle; muted?: boolean; size?: number; weight?: TextStyle['fontWeight']; center?: boolean }) {
  const c = useColors();
  return (
    <Text style={[{ color: muted ? c.textMuted : c.text, fontSize: size, fontWeight: weight, lineHeight: size * 1.4, textAlign: center ? 'center' : undefined }, style]}>
      {children}
    </Text>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return <T size={28} weight="800">{children}</T>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <T size={20} weight="700">{children}</T>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  color,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  color?: string;
  icon?: string;
  style?: ViewStyle;
}) {
  const c = useColors();
  const bg =
    variant === 'primary' ? color ?? c.primary : variant === 'secondary' ? c.cardAlt : variant === 'danger' ? c.dangerSoft : 'transparent';
  const fg = variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? c.danger : color ?? c.text;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        { backgroundColor: bg, borderRadius: 16, paddingVertical: 15, paddingHorizontal: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {icon ? <Text style={{ fontSize: 18 }}>{icon}</Text> : null}
      <Text style={{ color: fg, fontSize: 17, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}

export function ProgressBar({ value, color, height = 10 }: { value: number; color?: string; height?: number }) {
  const c = useColors();
  return (
    <View style={{ height, backgroundColor: c.cardAlt, borderRadius: height, overflow: 'hidden' }}>
      <View style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, height: '100%', backgroundColor: color ?? c.primary, borderRadius: height }} />
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: selected ? c.primary : c.border,
        backgroundColor: selected ? c.primarySoft : c.card,
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: selected ? c.primary : c.text, fontWeight: '700', fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

/** Botón de altavoz: lee el texto con la voz del idioma. */
export function SpeakButton({ text, lang, size = 44, slowToggle = false }: { text: string; lang: LangCode; size?: number; slowToggle?: boolean }) {
  const c = useColors();
  const { data } = useStore();
  const slow = data.profile?.slowAudio ?? false;
  const sl = courses[lang].speechLang;
  const btn = (label: string, isSlow: boolean) => (
    <Pressable
      accessibilityLabel={isSlow ? 'Escuchar despacio' : 'Escuchar'}
      onPress={() => speak(text, sl, isSlow)}
      style={({ pressed }) => ({ width: size, height: size, borderRadius: size / 2, backgroundColor: c.primarySoft, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
    >
      <Text style={{ fontSize: size * 0.45 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {btn('🔊', slow)}
      {slowToggle ? btn('🐢', true) : null}
    </View>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>;
}

export function Stat({ value, label, emoji }: { value: string | number; label: string; emoji: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: c.border, alignItems: 'center', gap: 2 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <T size={20} weight="800">{value}</T>
      <T size={12} muted center>
        {label}
      </T>
    </View>
  );
}

export const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
