import { useColorScheme } from 'react-native';
import { useStore } from './state/store';
import type { LangCode } from './types';

const light = {
  bg: '#F6F5FB',
  card: '#FFFFFF',
  cardAlt: '#EFEDF8',
  text: '#1C1B29',
  textMuted: '#6B6980',
  border: '#E3E1EE',
  primary: '#5B4FE0',
  primaryText: '#FFFFFF',
  primarySoft: '#ECEAFF',
  success: '#17A35B',
  successSoft: '#E3F7EC',
  danger: '#E0473E',
  dangerSoft: '#FDE8E6',
  warning: '#D98A00',
  warningSoft: '#FFF4DB',
  en: '#2A62D9',
  no: '#C8323A',
  dark: false,
};

const dark: typeof light = {
  bg: '#111019',
  card: '#1C1B27',
  cardAlt: '#262535',
  text: '#F2F1F8',
  textMuted: '#A3A1B8',
  border: '#2F2E40',
  primary: '#8A80FF',
  primaryText: '#111019',
  primarySoft: '#2A2750',
  success: '#3DD68C',
  successSoft: '#163527',
  danger: '#FF6B61',
  dangerSoft: '#3D1D1B',
  warning: '#FFB938',
  warningSoft: '#3A2D10',
  en: '#6E9BFF',
  no: '#FF6B72',
  dark: true,
};

export type Colors = typeof light;

export function useColors(): Colors {
  const scheme = useColorScheme();
  const { data } = useStore();
  const pref = data.profile?.theme ?? 'system';
  const isDark = pref === 'dark' || (pref === 'system' && scheme === 'dark');
  return isDark ? dark : light;
}

export function langColor(c: Colors, lang: LangCode) {
  return lang === 'en' ? c.en : c.no;
}
