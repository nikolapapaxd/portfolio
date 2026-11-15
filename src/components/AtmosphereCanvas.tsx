import React, { useEffect, useRef, useState } from 'react';
import {
  BackgroundType,
  CursorEffectType,
  NATURE_MOUNTAIN_4K_URL,
  ParticleEffectType,
} from '../types';

interface AtmosphereCanvasProps {
  backgroundType: BackgroundType;
  backgroundUrl: string;
  particleEffect: ParticleEffectType;
  cursorEffect: CursorEffectType;
  accentColor: string;
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = React.memo(
  ({ backgroundType, backgroundUrl, cursorEffect }) => {
    const spotlightRef = useRef<HTMLDivElement | null>(null);
    const [videoError, setVideoError] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      setVideoError(false);
      setImageError(false);
    }, [backgroundUrl, backgroundType]);

    // Zero-idle-CPU hardware-accelerated cursor spotlight (updates only on fine-pointer desktop devices)
    useEffect(() => {
      if (cursorEffect === 'none') return;
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
      const el = spotlightRef.current;
      if (!el) return;

      let rafId: number | null = null;
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          if (!el) return;
          el.style.transform = `translate3d(${mouseX - 90}px, ${mouseY - 90}px, 0)`;
          el.style.opacity = '1';
        });
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [cursorEffect]);

    const effectiveImageUrl =
      backgroundUrl && !imageError ? backgroundUrl : NATURE_MOUNTAIN_4K_URL;

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#060608]">
        {/* Custom Video Backdrop if configured */}
        {backgroundType === 'custom-video' && backgroundUrl && !videoError ? (
          <video
            src={backgroundUrl}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-65 grayscale contrast-125"
          />
        ) : (
          /* Custom Full-Color High-Contrast Backdrop Wallpaper */
          <img
            src={effectiveImageUrl}
            alt="Profile Background Wallpaper"
            referrerPolicy="no-referrer"
            decoding="async"
            fetchPriority="high"
            onError={() => setImageError(true)}
            style={{
              filter: 'contrast(1.08) brightness(0.95)',
            }}
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] will-change-transform"
          />
        )}

        {/* Compositor-Driven Ambient Mist Layer (0% Main-Thread CPU) */}
        <div
          className="absolute inset-0 animate-mist-drift will-change-transform opacity-50"
          style={{
            background: `
              radial-gradient(65% 40% at 25% 78%, rgba(228, 228, 231, 0.06) 0%, transparent 70%),
              radial-gradient(60% 38% at 75% 72%, rgba(212, 212, 216, 0.05) 0%, transparent 70%),
              radial-gradient(50% 30% at 50% 85%, rgba(244, 244, 246, 0.04) 0%, transparent 75%)
            `,
          }}
        />

        {/* Balanced Vignette & Depth Scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 45%, rgba(0, 0, 0, 0.08) 0%, rgba(5, 5, 7, 0.65) 100%),
              linear-gradient(180deg, rgba(5, 5, 7, 0.25) 0%, rgba(5, 5, 7, 0.08) 45%, rgba(5, 5, 7, 0.72) 100%)
            `,
          }}
        />

        {/* Compact 120fps Hardware-Accelerated Cursor Spotlight */}
        {cursorEffect !== 'none' && (
          <div
            ref={spotlightRef}
            className="absolute top-0 left-0 w-[180px] h-[180px] rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%)',
            }}
          />
        )}
      </div>
    );
  }
);
