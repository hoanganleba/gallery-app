import DirEntry from '@/types/DirEntry';
import isEmptyArray from '@/utils/isEmptyArray';
import { Component, ComponentProps, Show, createEffect, createSignal, on, onCleanup } from 'solid-js';
import LoadingSpinners from './LoadingSpinners';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { HiSolidChevronRight, HiSolidChevronLeft, HiSolidMagnifyingGlassMinus, HiSolidMagnifyingGlassPlus } from 'solid-icons/hi';

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
  createEffect(() => {
    props.images
    setImageIndex(0)
  });

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
          disabled={imageIndex() === 0}
          class="absolute disabled:opacity-30 rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 left-8 text-neutral-50/80"
        >
          <HiSolidChevronLeft class="w-5 h-5" />
        </button>
        <img
          style={{ transform: `scale(${scale()})` }}
          draggable="false"
          class="h-full w-auto object-scale-down select-none transition duration-300 ease-in-out origin-center"
          src={convertFileSrc(props.images[imageIndex()].path)}
        />
        <button
          onClick={nextImage}
          disabled={imageIndex() === props.images.length - 1}
          class="absolute disabled:opacity-30 rounded-full p-3 bg-neutral-800/80 z-50 top-1/2 -translate-y-1/2 right-8 text-neutral-50/80"
        >
          <HiSolidChevronRight class="w-5 h-5" />
        </button>
        <div class="absolute top-10 right-8 flex flex-col items-center">
          <button onClick={upScale} class="p-3 text-neutral-50/80">
            <HiSolidMagnifyingGlassPlus class="w-5 h-5" />
          </button>
          <button onClick={downScale} class="p-3 text-neutral-50/80">
            <HiSolidMagnifyingGlassMinus class="w-5 h-5" />
          </button>
        </div>
      </>
    </Show>
  );
};

export default ImageView;
