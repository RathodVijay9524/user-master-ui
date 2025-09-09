import { useState, useRef } from 'react';

export const useAudioPlayback = () => {
  const [playingId, setPlayingId] = useState(null);
  const [progress, setProgress] = useState({});
  const audioRef = useRef(null);

  const playAudio = (id, url) => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(id);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((prev) => ({
          ...prev,
          [id]: (audio.currentTime / audio.duration) * 100,
        }));
      }
    };

    audio.onended = () => {
      setPlayingId(null);
      setProgress((prev) => ({ ...prev, [id]: 0 }));
      audioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingId(null);
      setProgress((prev) => ({ ...prev, [id]: 0 }));
      audioRef.current = null;
    };

    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setPlayingId(null);
      setProgress((prev) => ({ ...prev, [id]: 0 }));
      audioRef.current = null;
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  return {
    playingId,
    progress,
    playAudio,
    stopAudio,
  };
};
