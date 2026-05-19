import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export type IconName =
  | 'search' | 'bell' | 'heart' | 'home' | 'plus' | 'chat' | 'menu'
  | 'back' | 'chevR' | 'chevD' | 'close' | 'check' | 'share' | 'pin'
  | 'phone' | 'whatsapp' | 'camera' | 'filter' | 'sort' | 'eye' | 'star'
  | 'verified' | 'sparkles' | 'bolt' | 'badge' | 'globe' | 'car' | 'gauge'
  | 'cal' | 'shield' | 'doc' | 'edit' | 'trash' | 'upload' | 'play'
  | 'instagram' | 'facebook' | 'sync' | 'lock' | 'mail' | 'apple' | 'google'
  | 'dots' | 'send' | 'attach' | 'analytics' | 'building' | 'fuel' | 'cog'
  | 'questionmark' | 'flame' | 'tag' | 'scale' | 'history';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
};

export function Icon({ name, size = 20, color = '#0F0F10', strokeWidth = 1.8, fill = false }: Props) {
  const stroke = color;
  const sw = strokeWidth;
  const linecap = 'round' as const;
  const linejoin = 'round' as const;
  const common = { stroke, strokeWidth: sw, strokeLinecap: linecap, strokeLinejoin: linejoin, fill: 'none' as const };
  const filled = { fill: color };

  switch (name) {
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="11" cy="11" r="7" {...common} />
          <Path d="M20 20l-3.5-3.5" {...common} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 8a6 6 0 1112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" {...common} />
          <Path d="M10 21a2 2 0 004 0" {...common} />
        </Svg>
      );
    case 'heart':
      return fill ? (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 7C19 16.5 12 21 12 21z" {...filled} />
        </Svg>
      ) : (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5a5.5 5.5 0 019.5 7C19 16.5 12 21 12 21z" {...common} />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z" {...common} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 5v14M5 12h14" {...common} />
        </Svg>
      );
    case 'chat':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 12a8 8 0 11-3-6.2L21 5l-1 3.7A8 8 0 0121 12z" {...common} />
        </Svg>
      );
    case 'menu':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="8" r="4" {...common} />
          <Path d="M4 21c1-4.5 4.5-7 8-7s7 2.5 8 7" {...common} />
        </Svg>
      );
    case 'back':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M15 5l-7 7 7 7" {...common} />
        </Svg>
      );
    case 'chevR':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 6l6 6-6 6" {...common} />
        </Svg>
      );
    case 'chevD':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 9l6 6 6-6" {...common} />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 6l12 12M18 6L6 18" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 12l5 5 11-12" {...common} />
        </Svg>
      );
    case 'share':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3v13M7 8l5-5 5 5" {...common} />
          <Path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" {...common} />
        </Svg>
      );
    case 'pin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z" {...common} />
          <Circle cx="12" cy="9" r="2.5" {...common} />
        </Svg>
      );
    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" {...common} />
        </Svg>
      );
    case 'whatsapp':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M20.5 3.5A11 11 0 003.2 17l-1.2 4.5 4.6-1.2A11 11 0 1020.5 3.5zM12 20a8 8 0 01-4.1-1.1l-.3-.2-2.7.7.7-2.6-.2-.3A8 8 0 1112 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5 0-.7-.3-1.4-.7-2-1.3-.6-.6-1-1.3-1.3-2-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2.7 2.7 0 00-.8 2c0 1.2.9 2.3 1 2.5.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.8.6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z"
            {...filled}
          />
        </Svg>
      );
    case 'camera':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" {...common} />
          <Circle cx="12" cy="13" r="4" {...common} />
        </Svg>
      );
    case 'filter':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 5h18M6 12h12M10 19h4" {...common} />
        </Svg>
      );
    case 'sort':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4" {...common} />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" {...common} />
          <Circle cx="12" cy="12" r="3" {...common} />
        </Svg>
      );
    case 'star':
      return fill ? (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 2l3.1 6.5 7 1-5 5 1.2 7-6.3-3.4-6.3 3.4 1.2-7-5-5 7-1z" {...filled} />
        </Svg>
      ) : (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 2l3.1 6.5 7 1-5 5 1.2 7-6.3-3.4-6.3 3.4 1.2-7-5-5 7-1z" {...common} />
        </Svg>
      );
    case 'verified':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 1.5l2.4 1.8 3-.3 1.2 2.7 2.7 1.4-.4 3 1.6 2.5-1.9 2.3.3 3-2.8 1.1-1.5 2.6-2.9-.7-2.7 1.4-2.3-2-3 .1-1.3-2.7-2.7-1.5.6-3-1.4-2.5L2.3 8l-.1-3L5 4l1.6-2.6 2.8.8L12 1.5z"
            fill={color}
          />
          <Path d="M8 12l3 3 5-6" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3l1.5 4 4 1.5-4 1.5L12 14l-1.5-4-4-1.5 4-1.5L12 3z" {...common} />
          <Path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8.8-2.2z" {...common} />
        </Svg>
      );
    case 'bolt':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" {...common} />
        </Svg>
      );
    case 'badge':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" {...common} />
          <Path d="M9 12l2 2 4-4" {...common} />
        </Svg>
      );
    case 'globe':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" {...common} />
          <Path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" {...common} />
        </Svg>
      );
    case 'car':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 14l1.5-5a2 2 0 012-1.5h11a2 2 0 012 1.5L21 14M5 14h14v5H5z" {...common} />
          <Circle cx="8" cy="17" r="1.5" {...common} />
          <Circle cx="16" cy="17" r="1.5" {...common} />
        </Svg>
      );
    case 'gauge':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 16a8 8 0 1116 0" {...common} />
          <Path d="M12 16l4-4" {...common} />
        </Svg>
      );
    case 'cal':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="5" width="18" height="16" rx="2" {...common} />
          <Path d="M3 10h18M8 3v4M16 3v4" {...common} />
        </Svg>
      );
    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" {...common} />
          <Path d="M9 12l2 2 4-4" {...common} />
        </Svg>
      );
    case 'doc':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 3h9l4 4v14H6z" {...common} />
          <Path d="M14 3v5h5" {...common} />
        </Svg>
      );
    case 'edit':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 20l4-1 11-11-3-3-11 11-1 4z" {...common} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" {...common} />
        </Svg>
      );
    case 'upload':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 16V3M7 8l5-5 5 5" {...common} />
          <Path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" {...common} />
        </Svg>
      );
    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 4l13 8-13 8z" {...filled} />
        </Svg>
      );
    case 'instagram':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="3" width="18" height="18" rx="5" {...common} />
          <Circle cx="12" cy="12" r="4" {...common} />
          <Circle cx="17.5" cy="6.5" r="1" fill={color} />
        </Svg>
      );
    case 'facebook':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M22 12a10 10 0 10-11.6 9.9v-7H8v-3h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0022 12z"
            {...filled}
          />
        </Svg>
      );
    case 'sync':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 12a9 9 0 01-15 6.7L3 16M3 12a9 9 0 0115-6.7L21 8" {...common} />
          <Path d="M21 3v5h-5M3 21v-5h5" {...common} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="4" y="11" width="16" height="10" rx="2" {...common} />
          <Path d="M8 11V8a4 4 0 018 0v3" {...common} />
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3" y="5" width="18" height="14" rx="2" {...common} />
          <Path d="M3 7l9 6 9-6" {...common} />
        </Svg>
      );
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.6-2.9-1.8-3.5-1.8-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.3 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.9-3.2zM14 5.3c.7-.8 1.1-2 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.5z"
            {...filled}
          />
        </Svg>
      );
    case 'google':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M22 12.3c0-.8-.1-1.4-.2-2.1H12v4h5.7c-.2 1.3-1 2.4-2.2 3.1v2.6h3.5c2.1-1.9 3-4.7 3-7.6z" fill="#4285F4" />
          <Path d="M12 22c2.9 0 5.4-1 7.2-2.6l-3.5-2.6c-1 .6-2.2 1-3.7 1-2.8 0-5.2-1.9-6.1-4.5H2.3v2.7A10 10 0 0012 22z" fill="#34A853" />
          <Path d="M5.9 13.3c-.2-.6-.4-1.3-.4-2s.2-1.4.4-2V6.6H2.3a10 10 0 000 8.8l3.6-2.1z" fill="#FBBC05" />
          <Path d="M12 5.4c1.6 0 3 .6 4.1 1.6l3-3A10 10 0 002.3 6.6L5.9 9.3C6.8 6.7 9.2 5.4 12 5.4z" fill="#EA4335" />
        </Svg>
      );
    case 'dots':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="5" cy="12" r="1.4" fill={color} />
          <Circle cx="12" cy="12" r="1.4" fill={color} />
          <Circle cx="19" cy="12" r="1.4" fill={color} />
        </Svg>
      );
    case 'send':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" {...common} />
        </Svg>
      );
    case 'attach':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8" {...common} />
        </Svg>
      );
    case 'analytics':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...common} />
        </Svg>
      );
    case 'building':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="4" y="3" width="16" height="18" rx="1" {...common} />
          <Path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" {...common} />
        </Svg>
      );
    case 'fuel':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16" {...common} />
          <Path d="M3 21h15M16 11h2a2 2 0 012 2v3a2 2 0 002 2" {...common} />
        </Svg>
      );
    case 'cog':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="3" {...common} />
          <Path
            d="M19 12a7 7 0 00-.1-1.4l2-1.5-2-3.4-2.4.8a7 7 0 00-2.4-1.4L13.7 3h-3.4l-.4 2.1A7 7 0 007.5 6.5L5 5.7l-2 3.4 2 1.5A7 7 0 005 12c0 .5 0 1 .1 1.4L3 14.9l2 3.4 2.4-.8a7 7 0 002.4 1.4l.4 2.1h3.4l.4-2.1a7 7 0 002.4-1.4l2.4.8 2-3.4-2-1.5c.1-.4.1-.9.1-1.4z"
            {...common}
          />
        </Svg>
      );
    case 'questionmark':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" {...common} />
          <Path d="M9.5 9a2.5 2.5 0 015 0c0 2-2.5 2-2.5 4M12 17h.01" {...common} />
        </Svg>
      );
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1-2-1-4-1-6-2 1-5 4-6 8-2-1-3-3-3-3-1 2-1 4-1 7s3 8 7 8z" {...common} />
        </Svg>
      );
    case 'tag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 12V5a2 2 0 012-2h7l9 9-9 9-9-9z" {...common} />
          <Circle cx="8" cy="8" r="1.5" {...common} />
        </Svg>
      );
    case 'scale':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3v18M5 8h14M5 8l-3 8h6L5 8zM19 8l-3 8h6l-3-8z" {...common} />
        </Svg>
      );
    case 'history':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 12a9 9 0 109-9c-2.5 0-5 1-7 3M3 3v4h4" {...common} />
          <Path d="M12 7v5l3 2" {...common} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="9" {...common} />
        </Svg>
      );
  }
}
