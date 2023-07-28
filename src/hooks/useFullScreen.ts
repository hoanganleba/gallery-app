import { Accessor, createEffect, createSignal } from 'solid-js';

function useFullscreen(): [Accessor<boolean>, () => void, () => void] {
  const [isFullscreen, setIsFullscreen] = createSignal(false);

  function enterFullscreen() {
    const element = document.getElementById("main");
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setIsFullscreen(true);
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  }

  createEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  });

  function handleFullscreenChange() {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  }

  return [isFullscreen, enterFullscreen, exitFullscreen];
}

export default useFullscreen;
