import { Component, Match, Switch, createEffect, createSignal, on, onMount } from 'solid-js';
import TitleBar from '@/components/TitleBar';
import { dialog, invoke } from '@tauri-apps/api';
import DirEntry from './types/DirEntry';
import isImageExtension from '@/utils/isImageExtension';
import isVideoExtension from '@/utils/isVideoExtension';
import shuffleArray from '@/utils/shuffleArray';
import ImageView from './components/ImageView';
import VideoView from './components/VideoView';
import isStringEmpty from './utils/isStringEmpty';

const App: Component = () => {
  const [images, setImages] = createSignal<DirEntry[]>([]);
  const [videos, setVideos] = createSignal<DirEntry[]>([]);
  const [viewType, setViewType] = createSignal('image');
  const [dirPath, setDirPath] = createSignal('');

  const openDialog = async () => {
    const result = await dialog.open({ directory: true });
    if(result) {
      setDirPath(result as string);
    }
  };

  createEffect(
    on(
      dirPath,
      async () => {
        setImages([]);
        setVideos([]);
        const result = await invoke<DirEntry[]>('read_directory', { pathStr: dirPath() });
        setImages(shuffleArray(result.filter((item) => isImageExtension(item.path))));
        setVideos(shuffleArray(result.filter((item) => isVideoExtension(item.path))));
      },
      { defer: true }
    )
  );

  return (
    <div class="w-screen min-h-screen h-screen bg-neutral-950 overflow-hidden">
      <Switch fallback={<div>Not Found</div>}>
        <Match when={!isStringEmpty(dirPath())}>
          <TitleBar>
            <div class="flex h-full w-full justify-center items-center space-x-1.5">
              <button
                onClick={openDialog}
                class="text-neutral-50/80 p-1.5 hover:bg-neutral-800 transition duration-100 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                </svg>
              </button>
              <button
                onClick={() => setViewType('image')}
                class="text-neutral-50/80 p-1.5 hover:bg-neutral-800 transition duration-100 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path
                    fill-rule="evenodd"
                    d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewType('video')}
                class="text-neutral-50/80 p-1.5 hover:bg-neutral-800 transition duration-100 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path
                    fill-rule="evenodd"
                    d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.015H4.48c-.075.01-.152.015-.23.015h-1.5A1.75 1.75 0 011 15.265V4.75zm16.5 7.385V11.01a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zm0 2.005a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .108.069.2.165.235h1.585a.25.25 0 00.25-.25v-1.11zm-15 1.11v-1.11a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.164.235H2.75a.25.25 0 01-.25-.25zm2-4.24v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V11.01a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm13-2.005V7.88a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zM4.25 7.63a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V7.88a.25.25 0 01.25-.25h1.5zm0-3.13a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5zm11.5 1.625a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5zm-9 3.125a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </TitleBar>
          <div class="flex justify-center items-center h-full w-full p-10">
            <Switch fallback={<div>Not Found</div>}>
              <Match when={viewType() === 'image'}>
                <ImageView images={images()} />
              </Match>
              <Match when={viewType() === 'video'}>
                <VideoView videos={videos()} />
              </Match>
            </Switch>
          </div>
        </Match>
        <Match when={isStringEmpty(dirPath())}>
          <TitleBar />
          <div class="flex justify-center items-center h-full w-full p-10">
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
