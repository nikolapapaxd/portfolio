import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {
  Volume2,
  VolumeX,
  X,
  Info,
} from 'lucide-react';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  NIKLASH_PROFILE,
  BuiltInTrack,
  INITIAL_PROFILE_VIEWS,
  ProfileData,
  getRandomProfileTrack,
} from './types';
import { AtmosphereCanvas } from './components/AtmosphereCanvas';
import { ProfileCard } from './components/ProfileCard';
import { ProfileAudioEngine } from './utils/audioEngine';

import { VIEWS_STORAGE_KEY, FIRESTORE_PROFILE_ID } from './config';
// VIEWS_STORAGE_KEY imported from config

function getStoredViewsCount(): number {
  try {
    const raw = localStorage.getItem(VIEWS_STORAGE_KEY);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!Number.isNaN(parsed) && parsed >= INITIAL_PROFILE_VIEWS) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read error
  }
  return INITIAL_PROFILE_VIEWS;
}

export function App() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const randomTrack = getRandomProfileTrack();
    return {
      ...NIKLASH_PROFILE,
      songTitle: randomTrack.title,
      songArtist: randomTrack.artist,
      songUrl: randomTrack.id,
      songCoverUrl: randomTrack.coverUrl || NIKLASH_PROFILE.songCoverUrl,
      statusText: `Listening to ${randomTrack.title} — ${randomTrack.artist}`,
      viewsCount: getStoredViewsCount(),
    };
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [justIncrementedView, setJustIncrementedView] = useState(false);
  const hasRecordedViewRef = useRef(false);

  const [audioStatus, setAudioStatus] = useState({
    isPlaying: false,
    volume: 0.75,
    isMuted: false,
    currentTime: 0,
    duration: 30,
  });

  // Deduplicate audio status updates so sub-second timeupdate events don't cause redundant re-renders
  const audioEngineRef = useRef<ProfileAudioEngine | null>(null);
  if (!audioEngineRef.current) {
    audioEngineRef.current = new ProfileAudioEngine(() => {
      if (!audioEngineRef.current) return;
      const next = audioEngineRef.current.getStatus();
      setAudioStatus((prev) => {
        if (
          prev.isPlaying === next.isPlaying &&
          prev.volume === next.volume &&
          prev.isMuted === next.isMuted &&
          prev.currentTime === next.currentTime &&
          prev.duration === next.duration
        ) {
          return prev;
        }
        return next;
      });
    });
  }
  const audioEngine = audioEngineRef.current;

  // Cleanup Web Audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current?.destroy();
    };
  }, []);

  const handleSelectTrack = useCallback(
    (track: BuiltInTrack) => {
      setProfile((prev) => ({
        ...prev,
        songTitle: track.title,
        songArtist: track.artist,
        songUrl: track.id,
        songCoverUrl: track.coverUrl || prev.songCoverUrl,
        statusText: `Listening to ${track.title} — ${track.artist}`,
      }));
      void audioEngine.loadAndPlay(track.id);
    },
    [audioEngine]
  );

  // Increment profile views starting from 3023 (+1 when someone views)
  const recordProfileView = useCallback(() => {
    if (hasRecordedViewRef.current) return;
    hasRecordedViewRef.current = true;

    setProfile((prev) => {
      const baseViews = Math.max(prev.viewsCount || INITIAL_PROFILE_VIEWS, INITIAL_PROFILE_VIEWS);
      const nextViews = baseViews + 1;
      try {
        localStorage.setItem(VIEWS_STORAGE_KEY, String(nextViews));
      } catch {
        // Ignore storage write failure
      }
      return {
        ...prev,
        viewsCount: nextViews,
      };
    });

    setJustIncrementedView(true);
    window.setTimeout(() => setJustIncrementedView(false), 3200);

    // Also persist to Firestore if the cloud profile document exists
    const docRef = doc(db, 'profiles', FIRESTORE_PROFILE_ID);
    void getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<ProfileData>;
          const currentCloudViews =
            typeof data.viewsCount === 'number' ? data.viewsCount : INITIAL_PROFILE_VIEWS;
          return updateDoc(docRef, { viewsCount: currentCloudViews + 1 });
        }
        return undefined;
      })
      .catch(() => {
        // Ignore unauthenticated/offline update errors
      });
  }, []);

  // Load & subscribe to Aura Ayaan profile from Firestore
  useEffect(() => {
    const docRef = doc(db, 'profiles', FIRESTORE_PROFILE_ID);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const cloudData = snap.data() as ProfileData;
          const storedViews = getStoredViewsCount();
          const effectiveViews = Math.max(
            INITIAL_PROFILE_VIEWS,
            storedViews,
            typeof cloudData.viewsCount === 'number' ? cloudData.viewsCount : INITIAL_PROFILE_VIEWS
          );

          try {
            localStorage.setItem(VIEWS_STORAGE_KEY, String(effectiveViews));
          } catch {
            // Ignore storage write failure
          }

          setProfile((prev) => ({
            ...cloudData,
            displayName: NIKLASH_PROFILE.displayName,
            uidNumber: NIKLASH_PROFILE.uidNumber,
            bio: NIKLASH_PROFILE.bio,
            statusText: prev.statusText || NIKLASH_PROFILE.statusText,
            avatarUrl: NIKLASH_PROFILE.avatarUrl,
            backgroundType: 'custom-image',
            backgroundUrl: NIKLASH_PROFILE.backgroundUrl,
            typewriterBio: true,
            songTitle: prev.songTitle || NIKLASH_PROFILE.songTitle,
            songArtist: prev.songArtist || NIKLASH_PROFILE.songArtist,
            songUrl: prev.songUrl || NIKLASH_PROFILE.songUrl,
            songCoverUrl: prev.songCoverUrl || NIKLASH_PROFILE.songCoverUrl,
            badges: NIKLASH_PROFILE.badges,
            links: NIKLASH_PROFILE.links,
            viewsCount: effectiveViews,
          }));
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `profiles/${FIRESTORE_PROFILE_ID}`);
      }
    );

    return () => unsub();
  }, []);

  // Handle Enter Gate click -> start song, smoothly dissolve gate, reveal card, and increment view count (+1 from 3023)
  const handleEnterStage = () => {
    if (isEntering || hasEntered) return;
    setIsEntering(true);
    void audioEngine.loadAndPlay(profile.songUrl);
    recordProfileView();
    window.setTimeout(() => {
      setHasEntered(true);
    }, 240);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-[#050507] text-[#F4F4F6] selection:bg-zinc-600 selection:text-white overflow-x-hidden">
      {/* 4K Wallpaper & GPU Mist Canvas */}
      <AtmosphereCanvas
        backgroundType={profile.backgroundType}
        backgroundUrl={profile.backgroundUrl}
        particleEffect={profile.particleEffect}
        cursorEffect={profile.cursorEffect}
        accentColor={profile.accentColor}
      />

      {/* Luxury Minimalist Click-to-Enter Audio Gate */}
      {!hasEntered && (
        <div
          onClick={handleEnterStage}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEnterStage();
            }
          }}
          className={`fixed inset-0 z-50 bg-[#050507]/88 backdrop-blur-2xl flex flex-col items-center justify-center p-6 cursor-pointer select-none transition-[opacity,transform] duration-250 ease-out will-change-[opacity,transform] group ${
            isEntering ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          <div className="relative flex items-center justify-center px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-full bg-white/[0.04] active:scale-95 group-hover:bg-white/[0.07] border border-white/[0.14] group-hover:border-white/[0.28] shadow-[0_0_45px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:scale-105">
            <p className="text-sm sm:text-xl font-medium tracking-[0.22em] sm:tracking-[0.26em] lowercase text-zinc-200 group-hover:text-white font-display drop-shadow-[0_0_16px_rgba(255,255,255,0.4)] transition-colors">
              {profile.enterText || 'click to enter'}
            </p>
          </div>
        </div>
      )}

      {/* Subtle Audio Mute Button (Top-Left) & Minimal About Icon (Bottom-Right) with Mobile Safe-Area Insets */}
      {hasEntered && (
        <>
          <div
            className="fixed top-3 left-3 sm:top-5 sm:left-5 z-30 flex items-center gap-2"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
          >
            <button
              type="button"
              onClick={() => audioEngine.toggleMute()}
              aria-label={audioStatus.isMuted ? 'Unmute audio' : 'Mute audio'}
              className="w-10 h-10 sm:w-auto sm:h-auto sm:p-2.5 flex items-center justify-center rounded-full bg-black/55 hover:bg-black/70 active:scale-95 border border-white/15 text-zinc-200 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
            >
              {audioStatus.isMuted || audioStatus.volume === 0 ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <div
            className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-30"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              aria-label="About Profile"
              className="w-9 h-9 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 active:scale-95 border border-white/10 text-zinc-400 hover:text-white backdrop-blur-md transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      {/* Centered Profile Card — Responsive padding for mobile & desktop */}
      <main
        className="relative z-10 flex-1 flex items-center justify-center px-3 py-12 sm:p-6"
        style={{
          paddingTop: 'max(3rem, calc(env(safe-area-inset-top, 0px) + 2.75rem))',
          paddingBottom: 'max(2.75rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))',
        }}
      >
        {hasEntered && (
          <ProfileCard
            profile={profile}
            audioEngine={audioEngine}
            audioStatus={audioStatus}
            justIncrementedView={justIncrementedView}
            onSelectTrack={handleSelectTrack}
          />
        )}
      </main>

      {/* About Modal */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-[#0B0B0F] border border-white/15 p-5 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                About Profile
              </span>
              <button
                type="button"
                onClick={() => setAboutOpen(false)}
                aria-label="Close about dialog"
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-sm font-bold text-white font-display">{profile.displayName}</p>
            <p className="mt-1 text-xs text-zinc-400">
              Python &amp; Java Developer • Personal Profile
            </p>
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-xs font-medium text-zinc-300">Made By Aura Ayaan</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
