<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window"; 
import { ref } from 'vue';

const appWindow = getCurrentWindow();
const isProcessing = ref<boolean>(false);

const toggleMaximize = async (): Promise<void> => {
    if (isProcessing.value) return;
    
    isProcessing.value = true;
    try {
        const isMaximized = await appWindow.isMaximized();
        if (isMaximized) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
    } catch (error) {
        console.error('Failed to toggle window state:', error);
    } finally {
        // Reset after a short delay to prevent rapid double-clicks
        setTimeout(() => {
            isProcessing.value = false;
        }, 300);
    }
};

</script>

<template>
    <div class="h-8 bg-transparent w-full absolute top-0 z-[963] text-center" data-tauri-drag-region @dblclick="toggleMaximize"></div>
</template>
