export type BackgroundType =
  | 'preset-tokyo'
  | 'preset-obsidian'
  | 'preset-aurora'
  | 'preset-matrix'
  | 'custom-image'
  | 'custom-video';

export type ParticleEffectType = 'rain' | 'snow' | 'embers' | 'stars' | 'none';
export type CursorEffectType = 'glow' | 'crosshair' | 'trail' | 'none';

export type LinkPlatform =
  | 'discord'
  | 'github'
  | 'youtube'
  | 'spotify'
  | 'x'
  | 'instagram'
  | 'telegram'
  | 'steam'
  | 'web';

export interface ProfileLinkItem {
  title: string;
  url: string;
  subtitle: string;
  platform: LinkPlatform;
}

export interface ProfileData {
  handle: string;
  ownerId: string;
  displayName: string;
  bio: string;
  location: string;
  statusText: string;
  avatarUrl: string;
  backgroundType: BackgroundType;
  backgroundUrl: string;
  songTitle: string;
  songArtist: string;
  songUrl: string;
  songCoverUrl: string;
  accentColor: string;
  cardOpacity: number;
  cardBlur: number;
  particleEffect: ParticleEffectType;
  cursorEffect: CursorEffectType;
  enterText: string;
  typewriterBio: boolean;
  tiltEffect: boolean;
  showViews: boolean;
  viewsCount: number;
  uidNumber: number;
  badges: string[];
  links: string[]; // Serialized as "title|url|subtitle|platform"
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GuestbookEntry {
  id: string;
  handle: string;
  authorUid: string;
  authorName: string;
  message: string;
  createdAt?: unknown;
}

export const SVG_AVATAR_AURA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <radialGradient id="bw1" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#52525B"/>
      <stop offset="55%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </radialGradient>
    <linearGradient id="suit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#27272A"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" fill="url(#bw1)"/>
  <path d="M20 240 C20 100, 120 20, 120 20 C120 20, 220 100, 220 240" fill="none" stroke="#3F3F46" stroke-width="1.5" stroke-opacity="0.45"/>
  <path d="M48 240 C54 176, 86 158, 120 158 C154 158, 186 176, 192 240 Z" fill="url(#suit)" stroke="#52525B" stroke-width="1.2"/>
  <polygon points="98,162 120,198 142,162" fill="#E4E4E7"/>
  <polygon points="104,170 120,177 104,184" fill="#18181B"/>
  <polygon points="136,170 120,177 136,184" fill="#18181B"/>
  <circle cx="120" cy="177" r="3.5" fill="#27272A"/>
  <circle cx="120" cy="102" r="38" fill="#D4D4D8"/>
  <path d="M120 64 A38 38 0 0 1 158 102 A38 38 0 0 1 120 140 Z" fill="#71717A" fill-opacity="0.45"/>
  <path d="M80 98 C80 64, 160 64, 160 98 C152 78, 130 74, 120 78 C105 74, 88 80, 80 98 Z" fill="#18181B"/>
  <circle cx="120" cy="120" r="116" fill="none" stroke="#A1A1AA" stroke-opacity="0.25" stroke-width="2"/>
</svg>
`)}`;

export const SVG_AVATAR_KAI = SVG_AVATAR_AURA;

export const SVG_COVER_SYNTH = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs>
    <linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#27272A"/>
      <stop offset="50%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" fill="url(#c1)"/>
  <circle cx="120" cy="120" r="92" fill="none" stroke="#3F3F46" stroke-width="12"/>
  <circle cx="120" cy="120" r="66" fill="none" stroke="#27272A" stroke-width="8"/>
  <circle cx="120" cy="120" r="28" fill="#D4D4D8"/>
  <circle cx="120" cy="120" r="8" fill="#09090B"/>
</svg>
`)}`;

export const AESTHETIC_GRAY_WALLPAPER = '/assets/aistudio/zenitsu_4k.jpg';


export function serializeLink(item: ProfileLinkItem): string {
  const cleanTitle = item.title.replace(/\|/g, ' ').trim().slice(0, 80) || 'Link';
  const cleanUrl = item.url.replace(/\|/g, '').trim().slice(0, 300) || 'https://';
  const cleanSub = item.subtitle.replace(/\|/g, ' ').trim().slice(0, 80);
  const cleanPlatform = item.platform || 'web';
  return `${cleanTitle}|${cleanUrl}|${cleanSub}|${cleanPlatform}`;
}

export function parseLink(raw: string): ProfileLinkItem {
  const parts = raw.split('|');
  return {
    title: parts[0] || 'Untitled Link',
    url: parts[1] || 'https://',
    subtitle: parts[2] || '',
    platform: (parts[3] as LinkPlatform) || 'web',
  };
}

// ---- Identity / assets / playlist / default profile live in src/config.ts ----
// Re-export so existing imports keep working.
export {
  PROFILE as NIKLASH_PROFILE,
  PROFILE as AURA_AYAAN_PROFILE, // legacy alias
  INITIAL_PROFILES,
  INITIAL_VIEWS as INITIAL_PROFILE_VIEWS,
  AVATAR_URL as DHRUV_AVATAR_URL,
  BACKGROUND_URL as ZENITSU_WALLPAPER_URL,
  BACKGROUND_URL as NATURE_MOUNTAIN_4K_URL,
  SONG_URL as KARAN_AUJLA_52_BARS_URL,
  SONG_COVER_URL as KARAN_AUJLA_52_BARS_COVER,
  PLAYLIST as PROFILE_PLAYLIST,
  getRandomTrack as getRandomProfileTrack,
  VIEWS_STORAGE_KEY,
  FIRESTORE_PROFILE_ID,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from './config';

export type { ConfigTrack as BuiltInTrack } from './config';

// Extra cover/url aliases used by leftover playlist entries in old code paths
export const KARAN_AUJLA_LOW_FADED_URL = '/assets/aistudio/low_faded.mp3';
export const KARAN_AUJLA_LOW_FADED_COVER =
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/c5/90/57c590ec-7991-aab9-f3a9-59ae74e8ed96/5064020420892_cover.jpg/300x300bb.jpg';

export const BUILT_IN_TRACKS = []; // playlist is fully driven by config.PLAYLIST
