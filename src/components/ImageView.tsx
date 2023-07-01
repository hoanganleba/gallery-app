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

  const upScale = () => scale() < 5 && setScale(scale() + 0.5);
  const downScale = () => scale() > 0.5 && setScale(scale() - 0.5);

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
      setScale(scale() + 0.5);
    }

    if (event.key === 'ArrowDown') {
      setScale(scale() - 0.5);
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onCleanup(() => window.removeEventListener('keydown', handleKeyDown));

  return (
    <Show when={!isEmptyArray(props.images)} fallback={<LoadingSpinners />}>
      <>
        <button
          onClick={prevImage}
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
        <img
          style={{ transform: `scale(${scale()})` }}
          draggable="false"
          class="h-full w-auto object-scale-down select-none transition duration-300 ease-in-out origin-center"
          src={convertFileSrc(props.images[imageIndex()].path)}
        />
        <button
          onClick={nextImage}
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
        <div class="absolute top-10 right-8 flex flex-col items-center">
          <button onClick={upScale} class="p-3 text-neutral-50/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M9 6a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 6z" />
              <path
                fill-rule="evenodd"
                d="M2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9zm7-5.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button onClick={downScale} class="p-3 text-neutral-50/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M6.75 8.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
              <path
                fill-rule="evenodd"
                d="M9 2a7 7 0 104.391 12.452l3.329 3.328a.75.75 0 101.06-1.06l-3.328-3.329A7 7 0 009 2zM3.5 9a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </>
    </Show>
  );
};

export default ImageView;
