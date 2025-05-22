<script setup lang="ts">
import Titlebar from './components/TitleBar.vue'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { open } from '@tauri-apps/plugin-dialog'
import DragAndDropView from './components/DragAndDropView.vue'
import Overlay from './components/Overlay.vue'
import { listen } from '@tauri-apps/api/event'

const ImageView = defineAsyncComponent(
    () => import('./components/ImageView.vue')
)

const folderPath = ref('')
const isOverlay = ref(false)

function openFolder() {
    open({
        multiple: false,
        directory: true,
    }).then((file) => {
        if (file) {
            folderPath.value = file
        }
    })
}

onMounted(async () => {
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
            e.preventDefault()
            openFolder()
        }
    })
    if (import.meta.env.MODE === 'production') {
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })
    }
    await listen('tauri://drag-over', () => {
        isOverlay.value = true
    })
    await listen('tauri://drag-leave', () => {
        isOverlay.value = false
    })
    await listen<{ paths: string[] }>('tauri://drag-drop', (event) => {
        const droppedPath = event.payload.paths[0]
        // Check if droppedPath looks like a directory (no file extension)
        if (droppedPath && !/\.[^\/\\]+$/.test(droppedPath)) {
            folderPath.value = droppedPath
        }
        isOverlay.value = false
    })
})
</script>

<template>
    <div class="w-screen h-screen bg-[#030609]">
        <Titlebar />
        <transition enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-95 blur-sm" enter-to-class="opacity-100 scale-100 blur-none"
            leave-active-class="transition duration-300 ease-in transform"
            leave-from-class="opacity-100 scale-100 blur-none" leave-to-class="opacity-0 scale-95 blur-sm">
            <Overlay v-if="isOverlay" />
        </transition>
        <transition enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 blur-sm scale-95" enter-to-class="opacity-100 blur-0 scale-100"
            leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 blur-0 scale-100"
            leave-to-class="opacity-0 blur-sm scale-95" mode="out-in">
            <DragAndDropView v-if="!folderPath" :openFolderFnProps="openFolder" />
            <ImageView v-else :folderPath="folderPath" :key="folderPath" />
        </transition>
    </div>
</template>

<style>
html,
body {
    @apply select-none overscroll-none overflow-hidden;
}
</style>
