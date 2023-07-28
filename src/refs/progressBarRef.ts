// progressBarRef.ts
import { createSignal, onCleanup } from 'solid-js';

export const useProgressBarRef = (
  duration: () => number,
  setCurrentTime: (value: number) => void,
  videoElement: () => HTMLVideoElement | null
) => {
  const progressBarRef = (el: HTMLDivElement) => {
    if (el) {
      const [isDragging, setIsDragging] = createSignal(false);

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

  return { progressBarRef };
};
