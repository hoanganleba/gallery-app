<script setup>
import ImageViewer from './views/ImageViewer.vue';
import TitleBar from './components/TitleBar.vue';

import { invoke } from '@tauri-apps/api/core';
import { ref, onMounted, onUnmounted } from 'vue';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import Overlay from './components/Overlay.vue';
import DropFolderViewer from './views/DropFolderViewer.vue';

const images = ref([]);
const loadSuccess = ref(false);
const isOvering = ref(false);

const loadImagesFromFolder = (path) => {
  invoke('read_images_directory', { path })
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
  let unlisten;

  try {
    const webview = getCurrentWebview();
    unlisten = webview.onDragDropEvent((event) => {
      if (event.payload.type === "over") {
        isOvering.value = true;
      } else if (event.payload.type === "leave") {
        isOvering.value = false;
      } else if (event.payload.type === "drop" && event.payload.paths.length > 0) {
        isOvering.value = false;
        loadImagesFromFolder(event.payload.paths[0]);
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
    <DropFolderViewer v-if="!loadSuccess" />
    <ImageViewer :images=images v-if="loadSuccess" />
  </div>
</template>