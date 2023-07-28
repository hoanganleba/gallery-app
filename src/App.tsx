import { Component, Match, Show, Switch, createEffect, createSignal, on } from 'solid-js';
import TitleBar from '@/components/TitleBar';
import { dialog, invoke } from '@tauri-apps/api';
import DirEntry from './types/DirEntry';
import isImageExtension from '@/utils/isImageExtension';
import isVideoExtension from '@/utils/isVideoExtension';
import shuffleArray from '@/utils/shuffleArray';
import ImageView from './components/ImageView';
import VideoView from './components/VideoView';
import isStringEmpty from './utils/isStringEmpty';
import { listen } from '@tauri-apps/api/event';
import isEmptyArray from './utils/isEmptyArray';
import useFullscreen from './hooks/useFullScreen';

const App: Component = () => {
  const [isFullscreen, enterFullscreen, exitFullscreen] = useFullscreen();
  const [images, setImages] = createSignal<DirEntry[]>([]);
  const [videos, setVideos] = createSignal<DirEntry[]>([]);
  const [viewType, setViewType] = createSignal('image');
  const [directoryPath, setDirectoryPath] = createSignal('');

  const openDialog = async () => {
    const path = await dialog.open({ directory: true });
    if (path) {
      setDirectoryPath(path as string);
    }
  };

  listen('tauri://file-drop', (event) => {
    const path = (event.payload as any)[0];
    if (isImageExtension(path) || isVideoExtension(path)) {
      throw new Error('Not a directory. Please drop valid directory');
    } else {
      setDirectoryPath(path as string);
    }
  });

  createEffect(
    on(
      directoryPath,
      async () => {
        setImages([]);
        setVideos([]);
        setViewType('image');
        const result = await invoke<DirEntry[]>('read_directory', { pathStr: directoryPath() });
        setImages(shuffleArray(result.filter((item) => isImageExtension(item.path))));
        setVideos(shuffleArray(result.filter((item) => isVideoExtension(item.path))));
        isEmptyArray(images()) && setViewType('video');
      },
      { defer: true }
    )
  );

  return (
    <div id="main" class="w-screen min-h-screen h-screen bg-neutral-950 overflow-hidden">
      <Show when={!isFullscreen()}>
        <TitleBar />
      </Show>
      <Switch>
        <Match when={!isStringEmpty(directoryPath())}>
          <Switch>
            <Match when={viewType() === 'image'}>
              <div class="flex justify-center items-center h-full w-full p-8">
                <ImageView onVideoClicked={() => setViewType('video')} images={images()} />
              </div>
            </Match>
            <Match when={viewType() === 'video'}>
              <VideoView
                onFullscreenClicked={isFullscreen() ? exitFullscreen : enterFullscreen}
                isFullscreen={isFullscreen()}
                haveImages={!isEmptyArray(images())}
                onFolderClicked={openDialog}
                onImageClicked={() => setViewType('image')}
                videos={videos()}
              />
            </Match>
          </Switch>
        </Match>
        <Match when={isStringEmpty(directoryPath())}>
          <div class="flex justify-center items-center h-full w-full p-8">
            <div
              onClick={openDialog}
              class="text-white bg-neutral-800 w-[680px] h-64 flex justify-center items-center rounded-xl cursor-pointer"
            >
              <div>
                <div class="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-20 h-20"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </div>
                <p class="text-lg font-bold text-white text-center">
                  Drop your folder here, or <span class="font-bold text-indigo-400">browse</span>
                </p>
              </div>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default App;
