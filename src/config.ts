/**
 * ============================================================
 *  NIKLASH BASTOLA — SINGLE PROFILE CONFIG
 *  Edit everything here. Nowhere else.
 * ============================================================
 */

import type {
  BackgroundType,
  CursorEffectType,
  ParticleEffectType,
  ProfileData,
  ProfileLinkItem,
  LinkPlatform,
} from './types';

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------
export const SITE_TITLE = 'Niklash Bastola — Profile';
export const SITE_DESCRIPTION =
  'Niklash Bastola — Developer, Builder & Creator. Social Links & Audio Showcase.';

export const HANDLE = 'niklash';
export const OWNER_ID = 'demo_owner_niklash';
export const DISPLAY_NAME = 'Niklash Bastola';
export const BIO = 'Developer • Builder • Creator • Shipping tools & systems';
export const LOCATION = 'Nepal';
export const STATUS_TEXT = 'Listening to 52 Bars — Karan Aujla';
export const UID_NUMBER = 1;
export const BADGES: string[] = ['Verified', 'Developer', 'Builder', 'Early Supporter'];

// ---------------------------------------------------------------------------
// Assets (paths under /public)
// ---------------------------------------------------------------------------
export const AVATAR_URL = '/assets/aistudio/image_aa4930a7.png';
export const BACKGROUND_TYPE: BackgroundType = 'custom-image';
export const BACKGROUND_URL = '/assets/aistudio/zenitsu_4k.jpg';

// ---------------------------------------------------------------------------
// Default track (also used as first playlist entry)
// ---------------------------------------------------------------------------
export const SONG_TITLE = '52 Bars';
export const SONG_ARTIST = 'Karan Aujla & Ikky';
export const SONG_URL = '/assets/aistudio/52_bars.mp3';
export const SONG_COVER_URL =
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fc/bc/64/fcbc6417-8a88-7b5e-4490-8f53e537ffb0/859770181552_cover.jpg/300x300bb.jpg';

// ---------------------------------------------------------------------------
// Visual / UX
// ---------------------------------------------------------------------------
export const ACCENT_COLOR = '#E4E4E7';
export const CARD_OPACITY = 44;
export const CARD_BLUR = 24;
export const PARTICLE_EFFECT: ParticleEffectType = 'none';
export const CURSOR_EFFECT: CursorEffectType = 'glow';
export const ENTER_TEXT = 'click to enter';
export const TYPEWRITER_BIO = true;
export const TILT_EFFECT = true;
export const SHOW_VIEWS = true;
export const INITIAL_VIEWS = 3023;

// localStorage key for view counter (change if you want a fresh count)
export const VIEWS_STORAGE_KEY = 'niklash_profile_views_v1';

// Firestore document id under collection "profiles"
export const FIRESTORE_PROFILE_ID = HANDLE;

// ---------------------------------------------------------------------------
// Social / links
// Format: { title, url, subtitle, platform }
// platform: 'discord' | 'github' | 'youtube' | 'spotify' | 'x' | 'instagram' | 'telegram' | 'steam' | 'web'
// ---------------------------------------------------------------------------
export const LINKS: ProfileLinkItem[] = [
  {
    title: 'Discord',
    url: 'niklash',
    subtitle: 'niklash • Click to Copy',
    platform: 'discord',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/niklashgamerz',
    subtitle: '@niklashgamerz',
    platform: 'github',
  },
  {
    title: 'My Projects',
    url: 'https://github.com/niklashgamerz',
    subtitle: 'Tools, bots & systems',
    platform: 'github',
  },
];

// ---------------------------------------------------------------------------
// Playlist (audio engine / track switcher)
// ---------------------------------------------------------------------------
export interface ConfigTrack {
  id: string; // usually the mp3 path
  title: string;
  artist: string;
  bpm: number;
  description: string;
  coverUrl?: string;
}

export const PLAYLIST: ConfigTrack[] = [
  {
    id: SONG_URL,
    title: SONG_TITLE,
    artist: SONG_ARTIST,
    bpm: 96,
    description: 'Four You EP · Full Official Track (3:34)',
    coverUrl: SONG_COVER_URL,
  },
  {
    id: '/assets/aistudio/low_faded.mp3',
    title: 'Low Faded',
    artist: 'Karan Aujla & MXRCI',
    bpm: 95,
    description: 'Full Official Track (2:55) · Karan Aujla & MXRCI',
    coverUrl:
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/c5/90/57c590ec-7991-aab9-f3a9-59ae74e8ed96/5064020420892_cover.jpg/300x300bb.jpg',
  },
];

// ---------------------------------------------------------------------------
// Built profile object (consumed by App / types)
// ---------------------------------------------------------------------------
function serializeLink(item: ProfileLinkItem): string {
  const cleanTitle = item.title.replace(/\|/g, ' ').trim().slice(0, 80) || 'Link';
  const cleanUrl = item.url.replace(/\|/g, '').trim().slice(0, 300) || 'https://';
  const cleanSub = item.subtitle.replace(/\|/g, ' ').trim().slice(0, 80);
  const cleanPlatform = (item.platform || 'web') as LinkPlatform;
  return `${cleanTitle}|${cleanUrl}|${cleanSub}|${cleanPlatform}`;
}

export const PROFILE: ProfileData = {
  handle: HANDLE,
  ownerId: OWNER_ID,
  displayName: DISPLAY_NAME,
  bio: BIO,
  location: LOCATION,
  statusText: STATUS_TEXT,
  avatarUrl: AVATAR_URL,
  backgroundType: BACKGROUND_TYPE,
  backgroundUrl: BACKGROUND_URL,
  songTitle: SONG_TITLE,
  songArtist: SONG_ARTIST,
  songUrl: SONG_URL,
  songCoverUrl: SONG_COVER_URL,
  accentColor: ACCENT_COLOR,
  cardOpacity: CARD_OPACITY,
  cardBlur: CARD_BLUR,
  particleEffect: PARTICLE_EFFECT,
  cursorEffect: CURSOR_EFFECT,
  enterText: ENTER_TEXT,
  typewriterBio: TYPEWRITER_BIO,
  tiltEffect: TILT_EFFECT,
  showViews: SHOW_VIEWS,
  viewsCount: INITIAL_VIEWS,
  uidNumber: UID_NUMBER,
  badges: BADGES,
  links: LINKS.map(serializeLink),
};

export const INITIAL_PROFILES: Record<string, ProfileData> = {
  [HANDLE]: PROFILE,
};

export function getRandomTrack(): ConfigTrack {
  const i = Math.floor(Math.random() * PLAYLIST.length);
  return PLAYLIST[i] || PLAYLIST[0];
}
