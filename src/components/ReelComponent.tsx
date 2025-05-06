import { useRef, useEffect, useState } from 'react';

export default function ReelComponent({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const handleVideoClick = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted={muted}
        playsInline
        loop
        onClick={handleVideoClick}
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
