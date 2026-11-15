import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Send,
  Globe,
  Github,
  Youtube,
  Gamepad2,
  DollarSign,
  Flame,
  Star,
  Crown,
  Sparkles,
  ShieldCheck,
  Code2,
  MapPin,
  ArrowUpRight,
  Share2,
  Disc3,
} from 'lucide-react';
import {
  BuiltInTrack,
  LinkPlatform,
  PROFILE_PLAYLIST,
  ProfileData,
  SVG_AVATAR_AURA,
  SVG_COVER_SYNTH,
  parseLink,
} from '../types';
import { ProfileAudioEngine } from '../utils/audioEngine';

interface ProfileCardProps {
  profile: ProfileData;
  audioEngine: ProfileAudioEngine;
  audioStatus: {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    currentTime: number;
    duration: number;
  };
  justIncrementedView?: boolean;
  onSelectTrack?: (track: BuiltInTrack) => void;
}

export function getPlatformDisplayName(platform: LinkPlatform): string {
  switch (platform) {
    case 'github':
      return 'GitHub';
    case 'spotify':
      return 'Spotify';
    case 'discord':
      return 'Discord';
    case 'instagram':
      return 'Instagram';
    case 'youtube':
      return 'YouTube';
    case 'x':
      return 'X';
    case 'telegram':
      return 'Telegram';
    case 'steam':
      return 'Steam';
    default:
      return 'Website';
  }
}

export const PlatformIcon: React.FC<{ platform: LinkPlatform; className?: string }> = React.memo(
  ({ platform, className = 'w-5 h-5' }) => {
    switch (platform) {
      case 'github':
        return (
          <Github
            className={`${className} shrink-0 pointer-events-none block`}
            aria-hidden="true"
          />
        );
      case 'youtube':
        return (
          <Youtube
            className={`${className} shrink-0 pointer-events-none block`}
            aria-hidden="true"
          />
        );
      case 'spotify':
        return (
          <svg
            className={`${className} shrink-0 pointer-events-none block`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        );
      case 'steam':
        return (
          <Gamepad2
            className={`${className} shrink-0 pointer-events-none block`}
            aria-hidden="true"
          />
        );
      case 'discord':
        return (
          <svg
            className={`${className} shrink-0 pointer-events-none block`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg
            className={`${className} shrink-0 pointer-events-none block`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'x':
        return (
          <svg
            className={`${className} shrink-0 pointer-events-none block`}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'telegram':
        return (
          <Send className={`${className} shrink-0 pointer-events-none block`} aria-hidden="true" />
        );
      default:
        return (
          <Globe className={`${className} shrink-0 pointer-events-none block`} aria-hidden="true" />
        );
    }
  }
);

function getBadgeDisplayLabel(rawName: string): string {
  const lower = rawName.toLowerCase();
  if (lower.includes('crown') || lower.includes('owner') || lower.includes('founder') || lower.includes('king')) {
    return 'Crowned';
  }
  if (lower.includes('rich') || lower.includes('dollar') || lower.includes('diamond') || lower.includes('gem')) {
    return 'Rich Boi';
  }
  if (lower.includes('flame') || lower.includes('fire') || lower.includes('audio')) {
    return 'Trending';
  }
  if (lower.includes('star') || lower.includes('early')) {
    return 'Early Supporter';
  }
  if (lower.includes('dev') || lower.includes('code') || lower.includes('shader')) {
    return 'Developer';
  }
  if (lower.includes('verified')) {
    return 'Verified';
  }
  return rawName;
}

const BadgeSymbolIcon: React.FC<{ name: string }> = React.memo(({ name }) => {
  const lower = name.toLowerCase();
  const baseClass = 'w-4 h-4 text-zinc-100 shrink-0 pointer-events-none block';

  if (lower.includes('crown') || lower.includes('owner') || lower.includes('founder') || lower.includes('king')) {
    return <Crown className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
  }
  if (lower.includes('rich') || lower.includes('dollar') || lower.includes('diamond') || lower.includes('gem')) {
    return (
      <DollarSign
        className="w-4 h-4 text-white shrink-0 pointer-events-none block"
        strokeWidth={2.4}
        aria-hidden="true"
      />
    );
  }
  if (lower.includes('flame') || lower.includes('audio') || lower.includes('fire')) {
    return <Flame className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
  }
  if (lower.includes('star') || lower.includes('early')) {
    return <Star className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
  }
  if (lower.includes('dev') || lower.includes('code') || lower.includes('shader')) {
    return <Code2 className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
  }
  if (lower.includes('verified')) {
    return <ShieldCheck className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
  }
  return <Sparkles className={baseClass} strokeWidth={2.1} aria-hidden="true" />;
});

// Zero-shift Fixed-Anchor Hover & Tap Tooltip Wrapper (works on both desktop hover and mobile tap)
const HoverTooltip: React.FC<{ label: string; children: React.ReactNode }> = React.memo(
  ({ label, children }) => {
    const [touchVisible, setTouchVisible] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, []);

    const handleTouchStart = () => {
      setTouchVisible(true);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setTouchVisible(false);
      }, 1600);
    };

    return (
      <div
        onTouchStart={handleTouchStart}
        className="relative group/tooltip inline-flex items-center justify-center"
      >
        {children}
        <div
          role="tooltip"
          style={{ transform: 'translate3d(-50%, 0, 0)' }}
          className={`pointer-events-none absolute bottom-full mb-2.5 left-1/2 px-2.5 py-1 rounded-lg bg-[#08080C]/95 border border-white/20 text-[11px] font-semibold tracking-wide text-white whitespace-nowrap transition-opacity duration-200 ease-out shadow-[0_10px_28px_rgba(0,0,0,0.9)] z-40 ${
            touchVisible ? 'opacity-100' : 'opacity-0 group-hover/tooltip:opacity-100'
          }`}
        >
          {label}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#08080C] border-r border-b border-white/20"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);

// Glowing Blue Verified Tick SVG with Tooltip
const BlueVerifiedTick: React.FC = React.memo(() => (
  <HoverTooltip label="Verified Owner">
    <span className="inline-flex items-center justify-center w-6 h-6 select-none">
      <svg
        className="w-6 h-6 text-[#38BDF8] shrink-0 pointer-events-none block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-115"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Verified"
      >
        <path
          d="M9 12.75L11.25 15L15 9.75M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
          fill="#0284C7"
        />
        <path
          d="M12 2C13.3 2 14.5 2.6 15.2 3.6C16.4 3.3 17.7 3.7 18.6 4.6C19.5 5.5 19.9 6.8 19.6 8C20.6 8.7 21.2 9.9 21.2 11.2C21.2 12.5 20.6 13.7 19.6 14.4C19.9 15.6 19.5 16.9 18.6 17.8C17.7 18.7 16.4 19.1 15.2 18.8C14.5 19.8 13.3 20.4 12 20.4C10.7 20.4 9.5 19.8 8.8 18.8C7.6 19.1 6.3 18.7 5.4 17.8C4.5 16.9 4.1 15.6 4.4 14.4C3.4 13.7 2.8 12.5 2.8 11.2C2.8 9.9 3.4 8.7 4.4 8C4.1 6.8 4.5 5.5 5.4 4.6C6.3 3.7 7.6 3.3 8.8 3.6C9.5 2.6 10.7 2 12 2Z"
          fill="#38BDF8"
        />
        <path
          d="M9.5 11.5L11.25 13.25L15 9.25"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  </HoverTooltip>
));

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
}

// Isolated 60fps Audio Spectrum Visualizer with Mobile Touch Scrubbing & Desktop Click Seeking
const AudioSpectrumBars: React.FC<{
  audioEngine: ProfileAudioEngine;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}> = React.memo(({ audioEngine, isPlaying, currentTime, duration }) => {
  const [bars, setBars] = useState<number[]>(() => new Array(18).fill(18));

  useEffect(() => {
    if (!isPlaying) {
      setBars(new Array(18).fill(18));
      return;
    }
    const timer = window.setInterval(() => {
      setBars(audioEngine.getFrequencyBars(18));
    }, 65);
    return () => window.clearInterval(timer);
  }, [audioEngine, isPlaying]);

  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const seekFromClientX = (el: HTMLDivElement, clientX: number) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audioEngine.seek(ratio * duration);
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek song position"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      onClick={(e) => seekFromClientX(e.currentTarget, e.clientX)}
      onTouchStart={(e) => {
        if (e.touches[0]) {
          seekFromClientX(e.currentTarget, e.touches[0].clientX);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) {
          seekFromClientX(e.currentTarget, e.touches[0].clientX);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          audioEngine.seek(currentTime + 5);
        } else if (e.key === 'ArrowLeft') {
          audioEngine.seek(currentTime - 5);
        }
      }}
      className="mt-1.5 py-1 -my-1 relative group/seek select-none"
    >
      <div className="flex items-end gap-[2.5px] sm:gap-[3px] h-3" aria-hidden="true">
        {bars.map((val, i) => {
          const barPercent = ((i + 1) / bars.length) * 100;
          const isPassed = barPercent <= progressPercent;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-[height,background-color,opacity] duration-100 ease-out"
              style={{
                height: `${Math.max(20, val)}%`,
                backgroundColor: isPlaying
                  ? isPassed
                    ? '#FFFFFF'
                    : '#A1A1AA'
                  : 'rgba(255,255,255,0.18)',
                opacity: isPlaying ? (isPassed ? 0.95 : 0.55) : 0.35,
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

// Isolated Typewriter Bio Component (clean, borderless luxury typography)
const TypewriterBioLine: React.FC<{ bio: string; enabled: boolean }> = React.memo(
  ({ bio, enabled }) => {
    const [typedBio, setTypedBio] = useState(bio);

    useEffect(() => {
      if (!enabled) {
        setTypedBio(bio);
        return;
      }
      let idx = 0;
      setTypedBio('');
      const interval = window.setInterval(() => {
        idx += 1;
        setTypedBio(bio.slice(0, idx));
        if (idx >= bio.length) {
          window.clearInterval(interval);
        }
      }, 30);
      return () => window.clearInterval(interval);
    }, [bio, enabled]);

    if (!bio) return null;

    return (
      <div
        className="mt-3 sm:mt-3.5 px-1 text-xs sm:text-[13.5px] leading-relaxed font-medium text-zinc-200/95 tracking-wide min-h-[2.25rem] sm:min-h-[1.5rem] animate-fade-up"
        style={{ animationDelay: '360ms' }}
      >
        <span>{typedBio}</span>
        {enabled && (
          <span
            className="inline-block w-1.5 h-3.5 ml-1.5 align-middle animate-pulse bg-zinc-200 rounded-xs"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  audioEngine,
  audioStatus,
  justIncrementedView = false,
  onSelectTrack,
}) => {
  // Continuous spring-lerp physics refs for silky 120fps 3D tilt & interactive cursor glare
  const hitBoxRef = useRef<HTMLDivElement | null>(null);
  const cardSurfaceRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const borderGlowRef = useRef<HTMLDivElement | null>(null);

  const physicsRef = useRef({
    targetRx: 0,
    targetRy: 0,
    currentRx: 0,
    currentRy: 0,
    targetX: 50,
    targetY: 20,
    currentX: 50,
    currentY: 20,
    isHovering: false,
    rafId: null as number | null,
  });

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [coverBroken, setCoverBroken] = useState(false);

  const currentTrackIndex = useMemo(() => {
    const idx = PROFILE_PLAYLIST.findIndex((t) => t.id === profile.songUrl);
    return idx >= 0 ? idx : 0;
  }, [profile.songUrl]);

  const handleStepTrack = (direction: -1 | 1) => {
    const nextIdx =
      (currentTrackIndex + direction + PROFILE_PLAYLIST.length) % PROFILE_PLAYLIST.length;
    const nextTrack = PROFILE_PLAYLIST[nextIdx];
    if (nextTrack) {
      onSelectTrack?.(nextTrack);
    }
  };

  useEffect(() => {
    setAvatarBroken(false);
  }, [profile.avatarUrl]);

  useEffect(() => {
    setCoverBroken(false);
  }, [profile.songCoverUrl]);

  useEffect(() => {
    const state = physicsRef.current;
    return () => {
      if (state.rafId !== null) {
        window.cancelAnimationFrame(state.rafId);
      }
    };
  }, []);

  const startPhysicsLoop = () => {
    const state = physicsRef.current;
    if (state.rafId !== null) return;

    const tick = () => {
      // Smooth spring lerp toward target rotation & cursor coordinates
      state.currentRx += (state.targetRx - state.currentRx) * 0.11;
      state.currentRy += (state.targetRy - state.currentRy) * 0.11;
      state.currentX += (state.targetX - state.currentX) * 0.14;
      state.currentY += (state.targetY - state.currentY) * 0.14;

      if (cardSurfaceRef.current && profile.tiltEffect) {
        cardSurfaceRef.current.style.transform = `perspective(1200px) rotateX(${state.currentRx.toFixed(2)}deg) rotateY(${state.currentRy.toFixed(2)}deg) translateZ(0)`;
      }

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(160px circle at ${state.currentX.toFixed(1)}% ${state.currentY.toFixed(1)}%, rgba(255, 255, 255, 0.075), transparent 65%)`;
      }

      if (borderGlowRef.current) {
        borderGlowRef.current.style.background = `radial-gradient(130px circle at ${state.currentX.toFixed(1)}% ${state.currentY.toFixed(1)}%, rgba(255, 255, 255, 0.34), transparent 70%)`;
      }

      const settled =
        !state.isHovering &&
        Math.abs(state.currentRx) < 0.03 &&
        Math.abs(state.currentRy) < 0.03;

      if (settled) {
        state.currentRx = 0;
        state.currentRy = 0;
        if (cardSurfaceRef.current) {
          cardSurfaceRef.current.style.transform =
            'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        }
        state.rafId = null;
        return;
      }

      state.rafId = window.requestAnimationFrame(tick);
    };

    state.rafId = window.requestAnimationFrame(tick);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (!hitBoxRef.current) return;
    const rect = hitBoxRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

    const state = physicsRef.current;
    state.isHovering = true;
    state.targetRx = profile.tiltEffect ? -dy * 3.8 : 0;
    state.targetRy = profile.tiltEffect ? dx * 3.8 : 0;
    state.targetX = ((e.clientX - rect.left) / rect.width) * 100;
    state.targetY = ((e.clientY - rect.top) / rect.height) * 100;

    if (glareRef.current) glareRef.current.style.opacity = '1';
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = '1';

    startPhysicsLoop();
  };

  const handleMouseLeave = () => {
    const state = physicsRef.current;
    state.isHovering = false;
    state.targetRx = 0;
    state.targetRy = 0;
    if (glareRef.current) glareRef.current.style.opacity = '0';
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = '0';
    startPhysicsLoop();
  };

  const handleCopyTextLink = async (textToCopy: string, index: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(`${index}`);
      window.setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
    if (
      typeof navigator.share === 'function' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      try {
        await navigator.share({
          title: `${profile.displayName} — Profile`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share sheet
      }
    }
  };

  const parsedLinks = useMemo(() => profile.links.map(parseLink), [profile.links]);

  return (
    <div
      ref={hitBoxRef}
      data-profile-card="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[460px] sm:max-w-[480px] p-1 sm:p-2.5 animate-card-reveal"
    >
      <div
        ref={cardSurfaceRef}
        style={{
          transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)',
          backgroundColor: `rgba(11, 11, 15, ${(profile.cardOpacity ?? 48) / 100})`,
          backdropFilter: `blur(${profile.cardBlur ?? 28}px)`,
          WebkitBackdropFilter: `blur(${profile.cardBlur ?? 28}px)`,
        }}
        className="relative w-full rounded-[26px] sm:rounded-[32px] border border-white/[0.16] ring-1 ring-inset ring-white/[0.07] px-5 py-6 sm:px-9 sm:py-10 text-[#F4F4F6] shadow-[0_36px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(255,255,255,0.03)] transform-gpu will-change-transform"
      >
        {/* Top & Bottom Specular Liquid-Chrome Edge Hairlines */}
        <div
          className="pointer-events-none absolute top-0 inset-x-8 sm:inset-x-10 h-[1px] opacity-75"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.68) 50%, transparent 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 inset-x-12 sm:inset-x-16 h-[1px] opacity-35"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
          }}
        />

        {/* Cursor-Reactive Border Illumination */}
        <div
          ref={borderGlowRef}
          className="pointer-events-none absolute inset-0 rounded-[26px] sm:rounded-[32px] opacity-0 transition-opacity duration-500 mix-blend-screen overflow-hidden"
        />

        {/* Ambient Crown Glow + Interactive Cursor-Tracking Specular Glass Reflection */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[26px] sm:rounded-[32px] opacity-30 overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(244, 244, 246, 0.26) 0%, transparent 60%)',
          }}
        />
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[26px] sm:rounded-[32px] opacity-0 transition-opacity duration-500 overflow-hidden"
        />

        {/* Main Centered Content Column */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Centered Circular Avatar with Liquid-Platinum Rim & Ambient Halo */}
          <div
            className="relative group/avatar animate-fade-up"
            style={{ animationDelay: '40ms' }}
          >
            <div className="absolute -inset-2 rounded-full bg-white/15 opacity-55 group-hover/avatar:opacity-90 blur-md transition-opacity duration-500" />
            <div
              className="relative p-[2.5px] rounded-full overflow-hidden shadow-[0_0_46px_rgba(255,255,255,0.24)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/avatar:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.5) 100%)',
              }}
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-950 ring-2 ring-black/60">
                <img
                  src={avatarBroken || !profile.avatarUrl ? SVG_AVATAR_AURA : profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  onError={() => setAvatarBroken(true)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/avatar:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Centered Metallic Silver Display Name + Blue Verified Tick */}
          <div
            className="mt-3.5 sm:mt-4 flex items-center justify-center gap-2 animate-fade-up"
            style={{ animationDelay: '90ms' }}
          >
            <h1 className="text-2xl sm:text-[31px] font-bold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent font-display drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
              {profile.displayName}
            </h1>
            <BlueVerifiedTick />
          </div>

          {/* Floating Glassmorphic Badge Orbs Below Profile Name */}
          {profile.badges && profile.badges.length > 0 && (
            <div
              className="mt-3 sm:mt-3.5 flex items-center justify-center flex-wrap gap-2 sm:gap-2.5"
              aria-label="Profile badges"
            >
              {profile.badges.map((badge, idx) => {
                const label = getBadgeDisplayLabel(badge);
                const isRichBoi = label === 'Rich Boi';
                return (
                  <div
                    key={`${badge}-${idx}`}
                    className="animate-stagger-in"
                    style={{ animationDelay: `${220 + idx * 60}ms` }}
                  >
                    <HoverTooltip label={label}>
                      <button
                        type="button"
                        aria-label={label}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-b from-white/[0.11] to-white/[0.04] hover:from-white/[0.20] hover:to-white/[0.09] border flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu hover:scale-114 hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                          isRichBoi
                            ? 'border-white/[0.26] hover:border-white/[0.52] shadow-[0_6px_18px_rgba(255,255,255,0.14),inset_0_1px_0_rgba(255,255,255,0.32)] hover:shadow-[0_10px_26px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]'
                            : 'border-white/[0.15] hover:border-white/[0.38] shadow-[0_6px_18px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.24)] hover:shadow-[0_10px_24px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.42)]'
                        }`}
                      >
                        <BadgeSymbolIcon name={badge} />
                      </button>
                    </HoverTooltip>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clean Typewriter Bio Line */}
          <TypewriterBioLine bio={profile.bio} enabled={profile.typewriterBio} />

          {/* Glowing Social Icons Row with Individual Staggered Entrance */}
          {parsedLinks.length > 0 && (
            <div className="mt-3.5 sm:mt-4 flex items-center justify-center flex-wrap gap-2.5 sm:gap-3">
              {parsedLinks.map((item, idx) => {
                const platformName = getPlatformDisplayName(item.platform);
                const isHttp =
                  item.url.startsWith('http://') || item.url.startsWith('https://');
                const isCopied = copiedIndex === `${idx}`;
                const tooltipText = isCopied
                  ? `Copied: ${item.url}`
                  : !isHttp
                    ? `${platformName}: ${item.url}`
                    : platformName;
                return (
                  <div
                    key={`icon-${item.platform}-${idx}`}
                    className="animate-stagger-in"
                    style={{ animationDelay: `${420 + idx * 60}ms` }}
                  >
                    <HoverTooltip label={tooltipText}>
                      {isHttp ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={platformName}
                          className="w-10 h-10 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.16] hover:to-white/[0.07] border border-white/[0.12] hover:border-white/[0.34] text-zinc-200 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu hover:scale-112 hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.16)] hover:shadow-[0_10px_24px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.32)]"
                        >
                          <PlatformIcon platform={item.platform} className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleCopyTextLink(item.url, idx)}
                          aria-label={platformName}
                          className="w-10 h-10 rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.16] hover:to-white/[0.07] border border-white/[0.12] hover:border-white/[0.34] text-zinc-200 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu hover:scale-112 hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.16)] hover:shadow-[0_10px_24px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.32)]"
                        >
                          <PlatformIcon platform={item.platform} className="w-4 h-4" />
                        </button>
                      )}
                    </HoverTooltip>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stacked Luxury Frosted Glass Link Bars with Individual Staggered Entrance & Shimmer Sweep */}
          {parsedLinks.length > 0 && (
            <div className="mt-4 sm:mt-5 w-full space-y-2 sm:space-y-2.5">
              {parsedLinks.map((item, idx) => {
                const isCopied = copiedIndex === `${idx}`;
                const isHttp =
                  item.url.startsWith('http://') || item.url.startsWith('https://');

                const innerContent = (
                  <>
                    {/* Subtle Hover Glass Shimmer Sweep */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                    />
                    <div className="relative flex items-center justify-between gap-2.5 sm:gap-3 w-full">
                      <span className="w-8 h-8 rounded-lg bg-white/[0.07] group-hover:bg-white/[0.16] border border-white/[0.12] flex items-center justify-center text-zinc-200 group-hover:text-white transition-all duration-300 ease-out group-hover:scale-105 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                        <PlatformIcon platform={item.platform} className="w-4 h-4" />
                      </span>

                      <div className="min-w-0 flex-1 text-center">
                        <div className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-white tracking-wide truncate transition-colors">
                          {isCopied ? (
                            <span className="inline-flex items-center gap-1.5 text-zinc-200">
                              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              Copied: {item.url}
                            </span>
                          ) : (
                            item.title
                          )}
                        </div>
                        {item.subtitle && (
                          <div className="text-[10px] text-zinc-400 group-hover:text-zinc-300 truncate mt-0.5 transition-colors">
                            {item.subtitle}
                          </div>
                        )}
                      </div>

                      <span className="w-8 h-8 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.10] border border-transparent group-hover:border-white/[0.14] flex items-center justify-center text-zinc-400 group-hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
                        <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                      </span>
                    </div>
                  </>
                );

                const barClassName =
                  'relative overflow-hidden block w-full py-2.5 px-3 sm:px-3.5 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.03] hover:from-white/[0.13] hover:to-white/[0.06] border border-white/[0.12] hover:border-white/[0.30] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] active:scale-[0.985] active:translate-y-0 group shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_20px_rgba(0,0,0,0.38)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_14px_30px_rgba(0,0,0,0.55)]';

                return (
                  <div
                    key={`bar-${item.title}-${idx}`}
                    className="animate-stagger-in"
                    style={{ animationDelay: `${560 + idx * 80}ms` }}
                  >
                    {isHttp ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={barClassName}
                      >
                        {innerContent}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleCopyTextLink(item.url, idx)}
                        className={barClassName}
                      >
                        {innerContent}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sleek Monochrome Hi-Fi Audio Player Deck with Thumb-Friendly Track Switcher */}
          <div
            className="mt-4 sm:mt-5 w-full pt-3.5 sm:pt-4 border-t border-white/[0.10] animate-fade-up"
            style={{ animationDelay: '880ms' }}
          >
            <div className="flex items-center gap-2 px-2.5 py-2.5 sm:px-3 sm:py-3 rounded-2xl bg-black/50 border border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:border-white/[0.20]">
              {/* Left Arrow Track Selector */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleStepTrack(-1);
                }}
                aria-label="Previous song"
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/[0.24] text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-3 sm:h-3" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => audioEngine.togglePlay(profile.songUrl)}
                aria-label={audioStatus.isPlaying ? 'Pause track' : 'Play track'}
                className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 group bg-zinc-900 shadow-[0_6px_16px_rgba(0,0,0,0.65)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <img
                  src={
                    coverBroken || !profile.songCoverUrl ? SVG_COVER_SYNTH : profile.songCoverUrl
                  }
                  alt={profile.songTitle}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  onError={() => setCoverBroken(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  {audioStatus.isPlaying ? (
                    <Pause className="w-4 h-4 text-white" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" aria-hidden="true" />
                  )}
                </div>
              </button>

              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Disc3
                      className={`w-3.5 h-3.5 text-zinc-200 shrink-0 ${
                        audioStatus.isPlaying ? 'animate-spin' : ''
                      }`}
                      style={{ animationDuration: '4s' }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-white truncate">
                      {profile.songTitle}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono-num shrink-0">
                    {formatTime(audioStatus.currentTime)} / {formatTime(audioStatus.duration)}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {profile.songArtist}
                </div>

                {/* Interactive Seekable Progress Bar + 18-Bar Silver Spectrum Visualizer */}
                <AudioSpectrumBars
                  audioEngine={audioEngine}
                  isPlaying={audioStatus.isPlaying}
                  currentTime={audioStatus.currentTime}
                  duration={audioStatus.duration}
                />
              </div>

              <div className="hidden sm:flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => audioEngine.toggleMute()}
                  aria-label={audioStatus.isMuted ? 'Unmute audio' : 'Mute audio'}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {audioStatus.isMuted || audioStatus.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={audioStatus.isMuted ? 0 : audioStatus.volume}
                  onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                  aria-label="Audio volume"
                  className="w-11 accent-zinc-200 h-1 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>

              {/* Right Arrow Track Selector */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleStepTrack(1);
                }}
                aria-label="Next song"
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.10] hover:border-white/[0.24] text-zinc-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-3 sm:h-3" strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Bottom Footer Row: Eye Views Counter + Location + UID #2 & Share Link */}
          <div
            className="mt-3.5 sm:mt-4 w-full flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300 font-mono-num animate-fade-up"
            style={{ animationDelay: '960ms' }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {profile.showViews && (
                <HoverTooltip label="Profile Views">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-200">
                    <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{profile.viewsCount.toLocaleString()}</span>
                    {justIncrementedView && (
                      <span className="text-[10px] font-semibold text-zinc-300 animate-pulse">
                        +1
                      </span>
                    )}
                  </span>
                </HoverTooltip>
              )}
              {profile.location && (
                <HoverTooltip label="Location">
                  <span className="inline-flex items-center gap-1 text-zinc-400 text-[11px]">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {profile.location}
                  </span>
                </HoverTooltip>
              )}
            </div>

            <div className="flex items-center gap-2">
              <HoverTooltip label={`UID #${profile.uidNumber}`}>
                <span className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] text-zinc-300 hover:text-white transition-colors">
                  UID #{profile.uidNumber}
                </span>
              </HoverTooltip>

              <HoverTooltip label={copiedShare ? 'Copied URL' : 'Share Profile'}>
                <button
                  type="button"
                  onClick={() => void handleShareProfile()}
                  aria-label="Share profile link"
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.10] text-zinc-300 hover:text-white transition-all duration-200 hover:scale-108 active:scale-95"
                >
                  {copiedShare ? (
                    <Check className="w-3.5 h-3.5 text-zinc-100" aria-hidden="true" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </HoverTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
