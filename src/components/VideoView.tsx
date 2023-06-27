import DirEntry from '@/types/DirEntry';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Component, ComponentProps, Show, createSignal } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import isEmptyArray from '@/utils/isEmptyArray';

interface VideoViewProps extends ComponentProps<any> {
  videos: DirEntry[];
}

const VideoView: Component<VideoViewProps> = (props: VideoViewProps) => {
  const [videoIndex, setVideoIndex] = createSignal(0);
  const prevVideo = () => videoIndex() > 0 && setVideoIndex(videoIndex() - 1);
  const nextVideo = () => videoIndex() < props.videos.length - 1 && setVideoIndex(videoIndex() + 1);
  return (
    <Show when={!isEmptyArray(props.videos)} fallback={<LoadingSpinners />}>
      <>
        <button onClick={prevVideo} class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 left-8 text-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-left"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <video draggable="false" controls class="h-full w-auto" src={convertFileSrc(props.videos[videoIndex()].path)} />
        <button onClick={nextVideo} class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 right-8 text-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-right"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </>
    </Show>
  );
};

export default VideoView;
