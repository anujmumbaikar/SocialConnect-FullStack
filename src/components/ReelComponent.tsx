import { useRef, useEffect, useState } from 'react';

export default function ReelComponent({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Observe visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.8 }
    );

    const videoEl = videoRef.current;
    if (videoEl) observer.observe(videoEl);

    return () => {
      if (videoEl) observer.unobserve(videoEl);
    };
  }, []);

  // Play/Pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Update mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        loop
        muted={muted}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
      <button
        onClick={() => setMuted((m) => !m)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 2,
          padding: '8px 12px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}
