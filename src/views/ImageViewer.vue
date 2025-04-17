<script setup lang="ts">
import { ref, computed } from 'vue';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useEventListener, whenever, useIdle } from '@vueuse/core';

interface Image {
    path: string;
    name: string;
}

const props = defineProps<{
    images: Image[];
}>();

const { idle } = useIdle(1000);
const isPlaying = ref(false);
const interval = ref<number | null>(null);

const currentIndex = ref(0);
const images = ref<Image[]>(props.images);

const startSlideshow = (): void => {
    if (isPlaying.value) return;
    isPlaying.value = true;
    interval.value = setInterval(() => {
        if (currentIndex.value < images.value.length - 1) {
            currentIndex.value++;
        } else {
            currentIndex.value = 0; // Loop back to the first image
        }
    }, 2000); // Change image every 2 seconds
};

const stopSlideshow = (): void => {
    isPlaying.value = false;
    if (interval.value !== null) {
        clearInterval(interval.value);
    }
};

const toggleSlideshow = (): void => {
    if (isPlaying.value) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
};

whenever(() => props.images, () => {
    images.value = props.images;
    currentIndex.value = 0; // Reset index when new images are passed
});

const currentImage = computed(() => images.value[currentIndex.value]);
const nextImage = (): void => {
    if (currentIndex.value < images.value.length - 1) {
        currentIndex.value++;
    }
};

const prevImage = (): void => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const isFirstImage = computed(() => currentIndex.value === 0);
const isLastImage = computed(() => currentIndex.value === images.value.length - 1);

const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowLeft') {
        prevImage();
    } else if (event.key === 'ArrowRight') {
        nextImage();
    } else if (event.key === ' ') {
        toggleSlideshow();
    }
};

useEventListener(window, 'keydown', handleKeydown);
</script>

<template>
    <button
        :class="idle ? 'opacity-0' : 'opacity-100 disabled:opacity-50'"
        class="absolute transition-opacity duration-300 ease-in-out top-1/2 left-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:cursor-not-allowed"
        :disabled="isFirstImage"
        @click="prevImage"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path
                fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd"
            />
        </svg>
    </button>
    <img
        draggable="false"
        :src="convertFileSrc(currentImage.path)"
        :alt="currentImage.name"
        class="object-contain h-full w-auto max-h-full"
    />
    <button
        class="absolute transition-opacity duration-300 ease-in-out top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-none rounded-full text-gray-100 bg-gray-900/50 flex justify-center items-center p-4.5 z-[369] cursor-pointer"
        @click="toggleSlideshow"
        :class="idle ? 'opacity-0' : 'opacity-100'"
    >
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path
                fill-rule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clip-rule="evenodd"
            />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path
                fill-rule="evenodd"
                d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                clip-rule="evenodd"
            />
        </svg>
    </button>
    <button
        :class="idle ? 'opacity-0' : 'opacity-100 disabled:opacity-50'"
        class="absolute top-1/2 right-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:cursor-not-allowed"
        :disabled="isLastImage"
        @click="nextImage"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path
                fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
            />
        </svg>
    </button>
    <div
        :class="idle ? 'opacity-0' : 'opacity-100'"
        class="absolute transition-opacity duration-300 ease-in-out bottom-0 w-full bg-transparent cursor-default text-gray-300 text-center px-3 py-2 text-[10px] z-[369]"
    >
        {{ currentIndex + 1 }} / {{ images.length }}
    </div>
</template>
