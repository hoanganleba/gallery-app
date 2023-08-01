import { appWindow } from '@tauri-apps/api/window';
import { createEffect, createSignal } from 'solid-js';

export const useFullScreenRef = () => {
  const [isFullScreen, setIsFullScreen] = createSignal(false);
  let elementRef: any;
  const fullScreenRef = (element: any) => {
    if (element) {
      elementRef = element;
      element.addEventListener('fullscreenchange', () => setIsFullScreen(!!document.fullscreenElement));
      element.addEventListener('webkitfullscreenchange', () => setIsFullScreen(!!document.webkitFullscreenElement));
      element.addEventListener('mozfullscreenchange', () => setIsFullScreen(!!document.mozFullScreenElement));
      element.addEventListener('msfullscreenchange', () => setIsFullScreen(!!document.msFullscreenElement));
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen()) {
      if (elementRef.requestFullscreen) {
        elementRef.requestFullscreen();
      } else if (elementRef.webkitRequestFullscreen) {
        elementRef.webkitRequestFullscreen();
      } else if (elementRef.mozRequestFullScreen) {
        elementRef.mozRequestFullScreen();
      } else if (elementRef.msRequestFullscreen) {
        elementRef.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  createEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'f') {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  createEffect(() => {
    return () => {
      if (isFullScreen()) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();f
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    };
  });

  return { fullScreenRef, isFullScreen, toggleFullScreen };
}