<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { convertFileSrc } from '@tauri-apps/api/core';

const props = defineProps({
    images: {
        type: Array,
        required: true
    }
});

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4.5 h-4.5">
            <path fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <div class="flex justify-center items-center w-screen h-screen overflow-hidden py-8 px-2">
        <img 
            draggable="false" 
            :src="convertFileSrc(currentImage.path)" 
            :alt="currentImage.name" 
            class="object-contain h-full w-auto max-h-full"
    />
    </div>
    <button
        class="absolute top-1/2 right-2 -translate-y-1/2 border-none rounded-full cursor-pointer text-gray-100 bg-gray-900/50 flex justify-center items-center p-4 z-[369] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLastImage" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4.5 h-4.5">
            <path fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd" />
        </svg>
    </button>
</template>
