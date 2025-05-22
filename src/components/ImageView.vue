<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { convertFileSrc, invoke } from '@tauri-apps/api/core'

const props = defineProps<{ folderPath?: string }>()

const imgLoaded = ref(false)
const images = ref<string[]>([])
const currentIndex = ref(0)

watchEffect(async () => {
    images.value = await invoke('read_images_dir', {
        folderPath: props.folderPath,
    })
    currentIndex.value = 0
})

watch(currentIndex, () => {
  imgLoaded.value = false
})

function prev() {
    if (images.value.length === 0) return
    currentIndex.value =
        (currentIndex.value - 1 + images.value.length) % images.value.length
}

function next() {
    if (images.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % images.value.length
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
        prev()
    } else if (event.key === 'ArrowRight') {
        next()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div
        class="w-full h-full flex justify-center items-center relative py-8 px-6"
    >
        <button
            @click="prev"
            class="absolute text-neutral-300 left-6 z-10 cursor-pointer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                />
            </svg>
        </button>
        <img
            v-if="images.length > 0"
            draggable="false"
            class="h-full w-auto object-contain transition-opacity duration-300 ease-in-out"
            :class="imgLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-95'"
            :src="convertFileSrc(images[currentIndex])"
            :key="convertFileSrc(images[currentIndex])"
            @load="imgLoaded = true"
        />
        <button
            @click="next"
            class="absolute text-neutral-300 right-6 z-10 cursor-pointer"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
            </svg>
        </button>
    </div>
</template>
