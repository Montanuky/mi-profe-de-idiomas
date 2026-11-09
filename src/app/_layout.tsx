import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from '../state/store';
import { useColors } from '../theme';

function Root() {
  const { ready } = useStore();
  const c = useColors();
  if (!ready)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  return (
    <>
      <StatusBar style={c.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.bg },
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.text,
          headerShadowVisible: false,
          headerBackTitle: 'Atrás',
        }}
      >
        <Stack.Screen name="vocabulary" options={{ headerShown: true, title: 'Vocabulario aprendido' }} />
        <Stack.Screen name="mistakes" options={{ headerShown: true, title: 'Historial de errores' }} />
        <Stack.Screen name="lesson/[id]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="exam/[unitId]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="review-session" options={{ gestureEnabled: false }} />
        <Stack.Screen name="placement" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
