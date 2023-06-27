import { Component, Show, createSignal, onMount, createEffect, on } from 'solid-js';
import TitleBar from '@/components/TitleBar';
import { invoke } from '@tauri-apps/api';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import DirEntry from './types/DirEntry';
import isImageExtension from '@/utils/isImageExtension';
import isVideoExtension from '@/utils/isVideoExtension';
import isEmptyArray from '@/utils/isEmptyArray';
import LoadingSpinners from '@/components/LoadingSpinners';
import shuffleArray from '@/utils/shuffleArray';

const App: Component = () => {
  const [images, setImages] = createSignal<DirEntry[]>([]);
  const [videos, setVideos] = createSignal<DirEntry[]>([]);
  const [imageIndex, setImageIndex] = createSignal(0);
  const [videoIndex, setVideoIndex] = createSignal(0);
  const [scale, setScale] = createSignal(1);

  const handleScaleChange = (event: Event) => {
    const newScale = parseFloat((event.target as HTMLInputElement).value);
    setScale(newScale);
  };

  const prevImage = () => imageIndex() > 0 && setImageIndex(imageIndex() - 1);
  const nextImage = () => imageIndex() < images().length - 1 && setImageIndex(imageIndex() + 1);

  onMount(async () => {
    const result = await invoke<DirEntry[]>('read_directory', { pathStr: '/Volumes/ExternalHDD' });
    setImages(shuffleArray(result.filter((item) => isImageExtension(item.path))));
    setVideos(result.filter((item) => isVideoExtension(item.path)));
  });

  createEffect(on(imageIndex, () => setScale(1)));

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      nextImage();
    }

    if (event.key === 'ArrowLeft') {
      prevImage();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return (
    <div class="w-screen min-h-screen h-screen bg-neutral-950 overflow-hidden">
      <TitleBar />
      <div class="flex justify-center items-center h-full w-full p-8">
      <Show when={!isEmptyArray(images())} fallback={<LoadingSpinners />}>
        <>
          <button
            onClick={prevImage}
            class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 left-8 text-neutral-50"
          >
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
          <img
            style={{ transform: `scale(${scale()})` }}
            draggable="false"
            class="h-full w-auto object-scale-down select-none transition duration-100 ease-in-out origin-center"
            src={convertFileSrc(images()[imageIndex()].path)}
          />
          <button
            onClick={nextImage}
            class="absolute rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 right-8 text-neutral-50"
          >
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
          <div class="absolute top-24 right-2">
            <input
              class="lighter-range"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale()}
              onInput={handleScaleChange}
            />
          </div>
        </>
      </Show>
      </div>
    </div>
  );
};

export default App;
