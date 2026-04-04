/** Ingosstrakh edu mini-app — theme tokens (reference + storage). */

export const THEME_STORAGE_KEY = 'ingosstrakh-theme';

export type ThemeMode = 'light' | 'dark';

export const brand = {
  blue: '#0066CC',
  blueBright: '#00A3FF',
  blueDark: '#003366',
  white: '#FFFFFF',
  light: {
    pageBg: '#F5F5F7',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    primaryBtn: '#0066CC',
    primaryBtnText: '#FFFFFF',
    secondaryBtn: '#E0E0E0',
    secondaryBtnText: '#0066CC',
  },
  dark: {
    pageBg: '#0D0D0D',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    primaryBtn: '#0066CC',
    primaryBtnText: '#FFFFFF',
    secondaryBtn: '#003366',
    secondaryBtnText: '#00A3FF',
  },
} as const;

export const motionTransition = {
  theme: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  page: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  stagger: 0.07,
};
