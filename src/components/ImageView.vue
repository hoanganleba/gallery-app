<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { convertFileSrc, invoke } from '@tauri-apps/api/core'

const props = defineProps<{ folderPath?: string }>()

const imgLoaded = ref(false)
const images = ref<string[]>([])
const currentIndex = ref(0)
const currentProgress = ref(0)
const isPlay = ref(false)
const isDisplayPlayPauseButton = ref(false)

let intervalId: any = null

watchEffect(async () => {
    images.value = await invoke('read_images_dir', {
        folderPath: props.folderPath,
    })
    currentIndex.value = 0
})

watch(currentIndex, () => {
    imgLoaded.value = false
})

watch(currentProgress, () => {
    if (currentProgress.value === 100) {
        next()
        currentProgress.value = 0
    } if (currentIndex.value === images.value.length - 1) {
        clearInterval(intervalId)
        isPlay.value = false
    }
})

watch(isPlay, () => {
    if (isPlay.value && currentIndex.value !== images.value.length - 1) {
        intervalId = setInterval(() => {
            currentProgress.value += 1
        }, 20)
    } else {
        clearInterval(intervalId)
    }
    if (currentIndex.value !== images.value.length - 1) {
        isDisplayPlayPauseButton.value = true
        setTimeout(() => {
            isDisplayPlayPauseButton.value = false
        }, 400)
    }
})

function play() {
    if (images.value.length === 0) return
    if (currentIndex.value !== images.value.length - 1) {
        isPlay.value = !isPlay.value
    }
}

function prev() {
    if (images.value.length === 0) return
    if (currentIndex.value !== 0) {
        currentIndex.value =
            (currentIndex.value - 1 + images.value.length) % images.value.length
    }
}

function next() {
    if (images.value.length === 0) return
    if (currentIndex.value !== images.value.length - 1) {
        currentIndex.value = (currentIndex.value + 1) % images.value.length
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
        prev()
    } else if (event.key === 'ArrowRight') {
        next()
    } else if (event.key === ' ') {
        play()
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
    <div class="w-full h-full flex justify-center items-center relative py-6 px-2">
        <div class="h-0.5 shadow-2xl shadow-indigo-800 absolute top-0 inset-x-1 rounded-full">
            <div class="h-full transition duration-150 bg-indigo-800" :style="`width: ${currentProgress}%`"></div>
        </div>
        <button @click="prev" :disabled="currentIndex === 0 || isPlay"
            class="absolute text-neutral-300/70 rounded-full left-2.5 bg-neutral-700/30 h-10.5 w-10.5 flex justify-center items-center z-10 cursor-pointer transition duration-300 ease-in-out disabled:opacity-30 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 -ml-1">
                <path fill-rule="evenodd"
                    d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                    clip-rule="evenodd" />
            </svg>
        </button>
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
        <img @click="play" v-if="images.length > 0" draggable="false"
            class="h-full w-auto object-contain transition duration-300 ease-in-out" :class="imgLoaded
                ? 'opacity-100 blur-0 scale-100'
                : 'opacity-0 blur-md scale-95'
                " :src="convertFileSrc(images[currentIndex])" :key="convertFileSrc(images[currentIndex])"
            @load="imgLoaded = true" />
        <button @click="next" :disabled="currentIndex === images.length - 1 || isPlay"
            class="absolute text-neutral-300/70 right-2.5 bg-neutral-700/30 h-10.5 w-10.5 flex justify-center items-center rounded-full z-10 cursor-pointer transition duration-300 ease-in-out disabled:opacity-30 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 -mr-0.5">
                <path fill-rule="evenodd"
                    d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>
