<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { convertFileSrc, invoke } from '@tauri-apps/api/core'

const props = defineProps<{ folderPath?: string }>()

const imgLoaded = ref(false)
const items = ref<string[]>([])
const currentIndex = ref(0)
const currentProgress = ref(0)
const isPlay = ref(false)
const isDisplayPlayPauseButton = ref(false)

let intervalId: any = null

const videoPlayer = ref<HTMLVideoElement | null>(null)

watchEffect(async () => {
    const images = await invoke<string[]>('read_images_dir', {
        folderPath: props.folderPath,
    })

    const videos = await invoke<string[]>('read_videos_dir', {
        folderPath: props.folderPath,
    })

    items.value = [...images, ...videos]

    currentIndex.value = 0
})

watch(currentIndex, () => {
    imgLoaded.value = false

    if (!isImage(currentIndex.value)) {
        clearInterval(intervalId)
        isPlay.value = false
    }
})

const isImage = (index: number) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(items.value[index])

watch(currentProgress, () => {
    // Only advance if the current item is an image
    if (!isImage(currentIndex.value)) return

    if (currentProgress.value === 100) {
        next()
        currentProgress.value = 0
    }
    
    if (currentIndex.value === items.value.length - 1) {
        clearInterval(intervalId)
        isPlay.value = false
    }
})

watch(isPlay, () => {
    // Only start interval if playing AND current item is an image
    if (isPlay.value && currentIndex.value !== items.value.length - 1 && isImage(currentIndex.value)) {
        intervalId = setInterval(() => {
            currentProgress.value += 1
        }, 20)
    } else {
        clearInterval(intervalId)
    }

    if (currentIndex.value !== items.value.length - 1) {
        isDisplayPlayPauseButton.value = true
        setTimeout(() => {
            isDisplayPlayPauseButton.value = false
        }, 400)
    }
})

function play() {
    if (items.value.length === 0) return

    // Only toggle play if current item is an image
    if (isImage(currentIndex.value) && currentIndex.value !== items.value.length - 1) {
        isPlay.value = !isPlay.value
    }
}

function prev() {
    if (items.value.length === 0) return
    if (currentIndex.value !== 0) {
        currentIndex.value =
            (currentIndex.value - 1 + items.value.length) % items.value.length
    }
}

function next() { 
    if (items.value.length === 0) return 
    if (currentIndex.value !== items.value.length - 1) { 
        currentIndex.value = 
            (currentIndex.value + 1) % items.value.length 
    } 
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
        prev()
    } else if (event.key === 'ArrowRight') {
        next()
    } else if (event.key === ' ') {
        // Only apply custom spacebar behavior for images
        if (isImage(currentIndex.value)) {
            event.preventDefault() // prevent scrolling
            play()
        } else {
            // Video: toggle play/pause
            if (videoPlayer.value) {
                if (videoPlayer.value.paused) {
                    videoPlayer.value.play()
                } else {
                    videoPlayer.value.pause()
                }
            }
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    clearInterval(intervalId)
})
</script>

<template>
    <div class="w-full h-full flex justify-center items-center relative">
        <button @click="play" :class="isDisplayPlayPauseButton ? 'animate-ping' : 'opacity-0'"
            class="absolute top-1/2 z-10 text-neutral-300/70 h-8 w-8 flex justify-center items-center rounded-full bg-[#030609]/30 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3.5"
                :class="isPlay ? '-mr-0.5' : ''">
                <path v-if="isPlay" fill-rule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clip-rule="evenodd" />
                <path v-else fill-rule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clip-rule="evenodd" />
            </svg>
        </button>
        <template v-if="items.length > 0">
            <img
                v-if="isImage(currentIndex)"
                @click="play"
                draggable="false"
                class="h-full w-auto object-contain transition duration-300 ease-in-out"
                :class="imgLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-95'"
                :src="convertFileSrc(items[currentIndex])"
                :key="'img-' + convertFileSrc(items[currentIndex])"
                @load="imgLoaded = true"
            />
            <video
                v-else
                controls
                ref="videoPlayer"
                class="h-full w-auto object-contain transition duration-300 ease-in-out"
                :src="convertFileSrc(items[currentIndex])"
                :key="'video-' + convertFileSrc(items[currentIndex])"
            />
        </template>
    </div>
</template>
