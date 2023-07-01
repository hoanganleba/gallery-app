import DirEntry from '@/types/DirEntry';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Component, ComponentProps, Show, createEffect, createSignal } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import isEmptyArray from '@/utils/isEmptyArray';

interface VideoViewProps extends ComponentProps<any> {
  videos: DirEntry[];
}

const VideoView: Component<VideoViewProps> = (props: VideoViewProps) => {
  const [videoIndex, setVideoIndex] = createSignal(0);
  const prevVideo = () => videoIndex() > 0 && setVideoIndex(videoIndex() - 1);
  const nextVideo = () => videoIndex() < props.videos.length - 1 && setVideoIndex(videoIndex() + 1);

  createEffect(() => {
    props.images
    setVideoIndex(0)
  });
  
  return (
    <Show when={!isEmptyArray(props.videos)} fallback={<LoadingSpinners />}>
      <>
        <button
          onClick={prevVideo}
          class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 left-8 text-neutral-50/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <video draggable="false" controls class="h-full w-auto" src={convertFileSrc(props.videos[videoIndex()].path)} />
        <button
          onClick={nextVideo}
          class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 right-8 text-neutral-50/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </>
    </Show>
  );
};

export default VideoView;
