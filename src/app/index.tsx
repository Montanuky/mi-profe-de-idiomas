import { Redirect } from 'expo-router';
import React from 'react';
import { useStore } from '../state/store';

export default function Index() {
  const { data } = useStore();
  return <Redirect href={data.profile ? '/(tabs)' : '/onboarding'} />;
}
