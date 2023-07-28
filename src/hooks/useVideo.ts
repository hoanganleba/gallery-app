// videoState.ts
import DirEntry from '@/types/DirEntry';
import { createSignal, createEffect, on, onCleanup } from 'solid-js';

export const useVideo = (props: { videos: DirEntry[] }) => {
  const [videoIndex, setVideoIndex] = createSignal(0);
  const [videoElement, setVideoElement] = createSignal<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isMuted, setIsMuted] = createSignal(false);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);

  const togglePlay = () => {
    const video = videoElement();
    if (video) {
      isPlaying() ? video.pause() : video.play();
    }
  };

  const toggleMute = () => {
    const video = videoElement();
    if (video) {
      video.muted = !isMuted();
      setIsMuted(!isMuted());
    }
  };

  const prevVideo = () => setVideoIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  const nextVideo = () => setVideoIndex((prevIndex) => Math.min(prevIndex + 1, props.videos.length - 1));

  createEffect(() => {
    setVideoIndex(0);
    const video = videoElement();
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', nextVideo);

    onCleanup(() => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', nextVideo);
    });
  });

  createEffect(
    on(videoIndex, () => {
      setCurrentTime(0);
      setIsPlaying(false);
    })
  );

  // Toggle play on space key press
  createEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        togglePlay();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        seekForward(5);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        seekBackward(5);
      } else if (event.key.toUpperCase() === 'M') {
        event.preventDefault();
        toggleMute();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyPress);
    });
  });

  const seekForward = (seconds: number) => {
    const video = videoElement();
    if (video) {
      const newTime = Math.min(video.currentTime + seconds, duration());
      setCurrentTime(newTime);
      video.currentTime = newTime;
    }
  };

  const seekBackward = (seconds: number) => {
    const video = videoElement();
    if (video) {
      const newTime = Math.max(video.currentTime - seconds, 0);
      setCurrentTime(newTime);
      video.currentTime = newTime;
    }
  };

  return {
    videoIndex,
    setVideoIndex,
    videoElement,
    setVideoElement,
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    isHovered,
    setIsHovered,
    isDragging,
    setIsDragging,
    togglePlay,
    toggleMute,
    prevVideo,
    nextVideo,
  };
};
