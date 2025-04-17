<script setup lang="ts">
import TitleBar from './components/TitleBar.vue';

import { invoke } from '@tauri-apps/api/core';
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { getCurrentWebview, WebviewWindow } from "@tauri-apps/api/webview";
import Overlay from './components/Overlay.vue';
import DropFolderViewer from './views/DropFolderViewer.vue';

const ImageViewer = defineAsyncComponent(() => import('./views/ImageViewer.vue'));

interface DragDropEventPayload {
  type: "over" | "leave" | "drop";
  paths?: string[];
}

const images = ref<string[]>([]);
const loadSuccess = ref<boolean>(false);
const isOvering = ref<boolean>(false);

const loadImagesFromFolder = (path: string): void => {
  invoke<string[]>('read_images_directory', { path })
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
  let unlisten: (() => void) | undefined;

  try {
    const webview: WebviewWindow = getCurrentWebview();
    unlisten = webview.onDragDropEvent((event: { payload: DragDropEventPayload }) => {
      const { type, paths } = event.payload;

      if (type === "over") {
        isOvering.value = true;
      } else if (type === "leave") {
        isOvering.value = false;
      } else if (type === "drop" && paths && paths.length > 0) {
        isOvering.value = false;
        loadImagesFromFolder(paths[0]);
      } else {
        isOvering.value = false;
      }
    });
  } catch (error) {
    console.error("Error setting up drag and drop listener:", error);
  }

  onUnmounted(() => {
    if (unlisten) {
      unlisten();
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