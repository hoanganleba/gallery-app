<script setup>
import { ref, computed } from 'vue';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useEventListener, whenever } from '@vueuse/core';

const props = defineProps({
    images: {
        type: Array,
        required: true
    }
});

const isPlaying = ref(false);
const interval = ref(null);
const startSlideshow = () => {
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
const stopSlideshow = () => {
    isPlaying.value = false;
    clearInterval(interval.value);
};
const toggleSlideshow = () => {
    if (isPlaying.value) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
};
const currentIndex = ref(0);
const images = ref(props.images);

whenever(() => props.images, () => {
    images.value = props.images;
    currentIndex.value = 0; // Reset index when new images are passed
});

const currentImage = computed(() => images.value[currentIndex.value]);
const nextImage = () => {
    if (currentIndex.value < images.value.length - 1) {
        currentIndex.value++;
    }
};
const prevImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};
const isFirstImage = computed(() => currentIndex.value === 0);
const isLastImage = computed(() => currentIndex.value === images.value.length - 1);
const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
        prevImage();
    } else if (event.key === 'ArrowRight') {
        nextImage();
    } else if (event.key === ' ') {
        toggleSlideshow();
    }
};

useEventListener(window, 'keydown', handleKeydown)
</script>

<template>
    <button
        class="absolute top-1/2 left-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isFirstImage" @click="prevImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <img draggable="false" :src="convertFileSrc(currentImage.path)" :alt="currentImage.name"
        class="object-contain h-full w-auto max-h-full" />
    <button
        class="absolute transition-opacity duration-300 ease-in-out top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-none rounded-full text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] cursor-pointer hover:opacity-100 opacity-0"
        @click="toggleSlideshow">
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            class="size-4.5">
            <path
                d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path
                d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
        </svg>
    </button>
    <button
        class="absolute top-1/2 right-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLastImage" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <div
        class="absolute bottom-0 w-full bg-transparent text-gray-300 text-center px-3 py-2 text-[10px] z-[369]">
        {{ currentIndex + 1 }} / {{ images.length }}
    </div>
</template>
