<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const images = ['https://picsum.photos/200/300', 'https://picsum.photos/200/300', 'https://picsum.photos/200/300', 'https://picsum.photos/200/300'];
const currentIndex = ref(0);
const currentImage = computed(() => images[currentIndex.value]);
const nextImage = () => {
    if (currentIndex.value < images.length - 1) {
        currentIndex.value++;
    }
};
const prevImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};
const isFirstImage = computed(() => currentIndex.value === 0);
const isLastImage = computed(() => currentIndex.value === images.length - 1);
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
    <button class="left-button" :disabled="isFirstImage" @click="prevImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon">
            <path fill-rule="evenodd"
                d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                clip-rule="evenodd" />
        </svg>
    </button>
    <img draggable="false" :src="currentImage" alt="Image" />
    <button class="right-button" :disabled="isLastImage" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon">
            <path fill-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd" />
        </svg>
    </button>
</template>

<style scoped>
.left-button {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
    border: none;
    border-radius: 99%;
    cursor: pointer;
    color: #f8f8f8;
    background-color: #181818;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    z-index: 369;
}

.left-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.right-button {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    border: none;
    border-radius: 99%;
    cursor: pointer;
    color: #f8f8f8;
    background-color: #181818;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    z-index: 369;
}

.right-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.icon {
    width: 18px;
    height: 18px;
}

img {
    width: auto;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>