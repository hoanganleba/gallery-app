import DirEntry from '@/types/DirEntry';
import isEmptyArray from '@/utils/isEmptyArray';
import { Component, ComponentProps, Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import { convertFileSrc } from '@tauri-apps/api/tauri';

interface ImageViewProps extends ComponentProps<any> {
  images: DirEntry[];
}

const ImageView: Component<ImageViewProps> = (props: ImageViewProps) => {
  const [imageIndex, setImageIndex] = createSignal(0);
  const [scale, setScale] = createSignal(1);

  const handleScaleChange = (event: Event) => {
    const newScale = parseFloat((event.target as HTMLInputElement).value);
    setScale(newScale);
  };

  const prevImage = () => imageIndex() > 0 && setImageIndex(imageIndex() - 1);
  const nextImage = () => imageIndex() < props.images.length - 1 && setImageIndex(imageIndex() + 1);

  createEffect(on(imageIndex, () => setScale(1)));

  const handleKeyDown = (event: any) => {
    if (event.key === 'ArrowRight') {
      nextImage();
    }

    if (event.key === 'ArrowLeft') {
      prevImage();
    }

    if (event.key === 'ArrowUp') {
      setScale(scale() + 0.1);
    }

    if (event.key === 'ArrowDown') {
      setScale(scale() - 0.1);
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onCleanup(() => window.removeEventListener('keydown', handleKeyDown));

  return (
    <Show when={!isEmptyArray(props.images)} fallback={<LoadingSpinners />}>
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
          src={convertFileSrc(props.images[imageIndex()].path)}
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
  );
};

export default ImageView;
