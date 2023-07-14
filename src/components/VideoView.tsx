import DirEntry from '@/types/DirEntry';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Component, ComponentProps, Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import isEmptyArray from '@/utils/isEmptyArray';
import {
  HiSolidPause,
  HiSolidPlay,
  HiSolidSpeakerWave,
  HiSolidSpeakerXMark,
  HiSolidForward,
  HiSolidBackward,
} from 'solid-icons/hi';
import { create } from 'domain';

interface VideoViewProps extends ComponentProps<any> {
  videos: DirEntry[];
}

const VideoView: Component<VideoViewProps> = (props: VideoViewProps) => {
  const [videoIndex, setVideoIndex] = createSignal(0);
  const [videoElement, setVideoElement] = createSignal<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isMuted, setIsMuted] = createSignal(false);
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);

  const progressBarRef = (el: HTMLDivElement) => {
    if (el) {
      const handleMouseDown = () => {
        setIsDragging(true);
      };

      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        if (isDragging()) {
          const progressBarRect = el.getBoundingClientRect();
          const clickOffsetX = event.clientX - progressBarRect.left;
          const progressBarWidth = progressBarRect.width;
          const newCurrentTime = (clickOffsetX / progressBarWidth) * duration();
          setCurrentTime(newCurrentTime);
          videoElement()!.currentTime = newCurrentTime ?? 0;
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      el.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      onCleanup(() => {
        el.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      });
    }
  };

  onCleanup(() => {
    videoElement()?.pause();
  });

  const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedHours = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    const formattedMinutes = `${minutes.toString().padStart(2, '0')}:`;
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return formattedHours + formattedMinutes + formattedSeconds;
  };

  const togglePlay = () => {
    const video = videoElement();
    if (video) {
      if (isPlaying()) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying());
    }
  };

  const toggleMute = () => {
    const video = videoElement();
    if (video) {
      video.muted = !isMuted();
      setIsMuted(!isMuted());
    }
  };
  const prevVideo = () => videoIndex() > 0 && setVideoIndex(videoIndex() - 1);
  const nextVideo = () => videoIndex() < props.videos.length - 1 && setVideoIndex(videoIndex() + 1);

  createEffect(
    on(
      videoIndex,
      () => {
        setCurrentTime(0);
        setIsPlaying(false);
      }
    )
  );

  createEffect(() => {
    props.images;
    setVideoIndex(0);
    const video = videoElement();
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

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

  return (
    <Show when={!isEmptyArray(props.videos)} fallback={<LoadingSpinners />}>
      <div class="relative h-full w-full pt-10">
        <video
          onClick={togglePlay}
          ref={setVideoElement}
          src={convertFileSrc(props.videos[videoIndex()].path)}
          class="my-auto h-full w-full"
        >
          Your browser does not support the video tag.
        </video>

        <div class="absolute bottom-0 bg-neutral-800/80 inset-x-0 z-10">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={progressBarRef}
            onclick={(event) => {
              const progressBarRect = event.currentTarget.getBoundingClientRect();
              const clickOffsetX = event.clientX - progressBarRect.left;
              const progressBarWidth = progressBarRect.width;
              const newCurrentTime = (clickOffsetX / progressBarWidth) * duration();
              setCurrentTime(newCurrentTime);
              videoElement()!.currentTime = newCurrentTime;
            }}
            class="w-full h-1 bg-neutral-300/80 cursor-pointer relative"
          >
            <div class="h-full bg-indigo-700" style={`width: ${(currentTime() / duration()) * 100}%`}></div>
            <Show when={isHovered() || isDragging()}>
              <div
                class="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-700"
                style={`left: ${(currentTime() / duration()) * 100}%`}
              ></div>
            </Show>
          </div>
          <div class="relative flex justify-between items-center px-3 py-2.5">
            <div class="h-full flex items-center space-x-3">
              <button disabled={videoIndex() === 0} class="text-neutral-50/80 disabled:opacity-30" onClick={prevVideo}>
                <HiSolidBackward class="w-5 h-5" />
              </button>
              <button class="text-neutral-50/80" onClick={togglePlay}>
                <Show when={!isPlaying()}>
                  <HiSolidPlay class="w-5 h-5" />
                </Show>
                <Show when={isPlaying()}>
                  <HiSolidPause class="w-5 h-5" />
                </Show>
              </button>
              <button
                disabled={videoIndex() === props.videos.length - 1}
                class="text-neutral-50/80 disabled:opacity-30"
                onClick={nextVideo}
              >
                <HiSolidForward class="w-5 h-5" />
              </button>
              <p class="text-neutral-50/80 text-sm cursor-default">
                {formatDuration(currentTime())} / {formatDuration(duration())}
              </p>
            </div>
            <button class="text-neutral-50/80" onClick={toggleMute}>
              <Show when={!isMuted()}>
                <HiSolidSpeakerWave class="w-5 h-5" />
              </Show>
              <Show when={isMuted()}>
                <HiSolidSpeakerXMark class="w-5 h-5" />
              </Show>
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default VideoView;
