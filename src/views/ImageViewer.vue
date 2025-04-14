<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { convertFileSrc } from '@tauri-apps/api/core';

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

watch(() => props.images, (newImages) => {
    images.value = newImages;
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
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
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
        class="absolute top-1/2 right-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLastImage" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4.5">
            <path fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <div
        class="absolute bottom-0 w-full bg-transparent text-gray-300 text-left px-3 py-2 text-[10px] flex items-center space-x-1.5 z-[369]">

        <button class="cursor-pointer" @click="toggleSlideshow">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                class="size-4">
                <path fill-rule="evenodd"
                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.847-9.766A.75.75 0 0 0 6 5.866v4.268a.75.75 0 0 0 1.153.633l3.353-2.134a.75.75 0 0 0 0-1.266L7.153 5.234Z"
                    clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                    d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM5.5 5.5A.5.5 0 0 1 6 5h.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-5Zm4-.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 10 5h-.5Z"
                    clip-rule="evenodd" />
            </svg>
        </button>
        <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
    </div>
</template>
