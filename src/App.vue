<script setup lang="ts">
import TitleBar from './components/TitleBar.vue';
import { Image } from './types/Image';

import { invoke } from '@tauri-apps/api/core';
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import Overlay from './components/Overlay.vue';
import DropFolderViewer from './views/DropFolderViewer.vue';
import { UnlistenFn } from '@tauri-apps/api/event';

const ImageViewer = defineAsyncComponent(() => import('./views/ImageViewer.vue'));

const images = ref<Image[]>([]);
const loadSuccess = ref<boolean>(false);
const isOvering = ref<boolean>(false);

const loadImagesFromFolder = (path: string): void => {
  invoke<Image[]>('read_images_directory', { path })
    .then((data) => {
      if (data.length === 0) {
        console.error('No images found in the directory.');
        return;
      }
      images.value = data;
      loadSuccess.value = true;
    })
    .catch((error) => {
      console.error('Error reading images directory:', error);
    });
};

onMounted(() => {
  let unlisten: Promise<UnlistenFn>;

  try {
    const webview = getCurrentWebview();
    unlisten = webview.onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        isOvering.value = true;
      } else if (event.payload.type === "leave") {
        isOvering.value = false;
      } else if (event.payload.type === "drop" && event.payload.paths && event.payload.paths.length > 0) {
        isOvering.value = false;
        loadImagesFromFolder(event.payload.paths[0]);
      } else {
        isOvering.value = false;
      }
    });
  } catch (error) {
    console.error("Error setting up drag and drop listener:", error);
  }

  onUnmounted(async () => {
    if (unlisten) {
      (await unlisten)();
    }
  });
});
</script>

<template>
  <div class="w-screen h-screen min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-2 py-8">
    <TitleBar />
    <Overlay :isOvering="isOvering" />
    <ImageViewer :images="images" v-if="loadSuccess" />
    <DropFolderViewer v-else />
  </div>
</template>