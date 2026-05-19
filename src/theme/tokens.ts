import { Platform } from 'react-native';

export const T = {
  gold: '#F5A623',
  goldDark: '#D88B0A',
  goldSoft: '#FFE9B8',
  goldTint: '#FFF6E0',

  ink: '#0F0F10',
  ink2: '#2A2A2C',
  body: '#4A4A4D',
  muted: '#8A8780',
  hairline: '#ECE9E0',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F5EF',
  bg: '#FAFAF7',

  green: '#1FAE6B',
  greenSoft: '#E1F5EB',
  red: '#E14B4B',
  redSoft: '#FCE6E6',
  blue: '#2E7DEB',
  blueSoft: '#E2EDFE',

  instagramFrom: '#F58529',
  instagramMid: '#DD2A7B',
  instagramTo: '#8134AF',
  facebook: '#1877F2',

  font: Platform.select({
    ios: 'Manrope',
    android: 'Manrope',
    default: 'Manrope, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  }) as string,
  mono: Platform.select({
    ios: 'JetBrainsMono',
    android: 'JetBrainsMono',
    default: 'JetBrains Mono, ui-monospace, "SF Mono", Menlo, monospace',
  }) as string,

  fs: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 16,
    xl: 18,
    h3: 22,
    h2: 28,
    h1: 34,
    hero: 44,
  },
  r: { sm: 8, md: 12, lg: 16, xl: 22, pill: 9999 },
};

export const shadow = {
  card: {
    shadowColor: '#0F0F10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  elev: {
    shadowColor: '#0F0F10',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  sticky: {
    shadowColor: '#0F0F10',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  goldGlow: {
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type Hue = number;

export function hueGradient(hue: Hue, dark = false): [string, string] {
  if (dark) {
    return [hslFromHue(hue, 0.22, 0.04), hslFromHue(hue, 0.12, 0.02)];
  }
  return [hslFromHue(hue, 0.85, 0.04), hslFromHue(hue, 0.62, 0.05)];
}

function hslFromHue(hue: number, l: number, c: number): string {
  const h = ((hue % 360) + 360) % 360;
  const s = Math.min(1, c * 2.2);
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
