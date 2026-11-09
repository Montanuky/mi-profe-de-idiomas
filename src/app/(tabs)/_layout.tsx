import { Redirect } from 'expo-router';
import Tabs from 'expo-router/js-tabs';
import React from 'react';
import { Text } from 'react-native';
import { useStore } from '../../state/store';
import { useColors } from '../../theme';

const icon = (emoji: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

export default function TabsLayout() {
  const c = useColors();
  const { data } = useStore();
  if (!data.profile) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: icon('🏠') }} />
      <Tabs.Screen name="course" options={{ title: 'Curso', tabBarIcon: icon('📚') }} />
      <Tabs.Screen name="review" options={{ title: 'Repaso', tabBarIcon: icon('🔁') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progreso', tabBarIcon: icon('📈') }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon('👤') }} />
    </Tabs>
  );
}
