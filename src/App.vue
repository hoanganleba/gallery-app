<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, ref } from 'vue'
import { open } from '@tauri-apps/plugin-dialog'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

const ImageVideoView = defineAsyncComponent(
    () => import('./components/ImageVideoView.vue')
)

const DragAndDropView = defineAsyncComponent(() =>
    import('./components/DragAndDropView.vue')
)

const Overlay = defineAsyncComponent(() =>
    import('./components/Overlay.vue')
)

const appWindow = getCurrentWindow()

const folderPath = ref('')
const isOverlay = ref(false)
const isFullScreen = ref(false)
const isActive = ref(true)
const startTime = ref(0)
const mouseHeldDuration = ref(0)

let mouseTimeout: ReturnType<typeof setTimeout> | null = null

function resetMouseTimeout() {
    isActive.value = true
    if (mouseTimeout) clearTimeout(mouseTimeout)
    mouseTimeout = setTimeout(() => {
        isActive.value = false
    }, 1000)
}

function openFolder() {
    open({
        multiple: false,
        directory: true,
    }).then((file: any) => {
        if (file) {
            folderPath.value = file
        }
    })
}

function startDragging() {
    startTime.value = new Date().getTime();
    appWindow.startDragging()
}

function stopDragging() {
    const endTime = new Date().getTime();
    mouseHeldDuration.value = (endTime - startTime.value) / 1000;
}

onMounted(() => {
    window.addEventListener('mousemove', resetMouseTimeout)
    resetMouseTimeout()
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
            e.preventDefault()
            openFolder()
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
            e.preventDefault()
            isFullScreen.value = !isFullScreen.value
            appWindow.setFullscreen(isFullScreen.value)
        }
    })
    if (import.meta.env.MODE === 'production') {
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })
    }
    nextTick(() => {
        listen('tauri://drag-over', () => {
            isOverlay.value = true
        })
        listen('tauri://drag-leave', () => {
            isOverlay.value = false
        })
        listen<{ paths: string[] }>('tauri://drag-drop', (event: any) => {
            const droppedPath = event.payload.paths[0]
            // Check if droppedPath looks like a directory (no file extension)
            if (droppedPath && !/\.[^\/\\]+$/.test(droppedPath)) {
                folderPath.value = droppedPath
            }
            isOverlay.value = false
        })
    })
})
</script>

<template>
    <div class="w-screen h-screen bg-black/85" :class="[isActive ? 'cursor-default' : 'cursor-none']"
        @mousedown="startDragging" @mouseup="stopDragging" @dblclick="() => appWindow.toggleMaximize()">
        <transition name="cursor-fade">
            <div v-if="isActive" class="fixed pointer-events-none inset-0 z-50" style="transition: opacity 0.3s;"></div>
        </transition>
        <transition enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-95 blur-sm" enter-to-class="opacity-100 scale-100 blur-none"
            leave-active-class="transition duration-300 ease-in transform"
            leave-from-class="opacity-100 scale-100 blur-none" leave-to-class="opacity-0 scale-95 blur-sm">
            <Overlay v-if="isOverlay" />
        </transition>
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 blur-sm scale-95"
            enter-to-class="opacity-100 blur-0 scale-100" leave-active-class="transition duration-300 ease-in"
            leave-from-class="opacity-100 blur-0 scale-100" leave-to-class="opacity-0 blur-sm scale-95" mode="out-in">
            <DragAndDropView v-if="!folderPath" />
            <ImageVideoView v-else :folderPath="folderPath" :mouseHeldDuration="mouseHeldDuration" :key="folderPath" />
        </transition>
    </div>
</template>

<style scoped>
.cursor-none {
    cursor: none !important;
    transition: cursor 0.3s;
}

.cursor-default {
    cursor: default !important;
    transition: cursor 0.3s;
}

.cursor-fade-enter-active,
.cursor-fade-leave-active {
    transition: opacity 0.3s;
}

.cursor-fade-enter-from,
.cursor-fade-leave-to {
    opacity: 0;
}

.cursor-fade-enter-to,
.cursor-fade-leave-from {
    opacity: 1;
}
</style>