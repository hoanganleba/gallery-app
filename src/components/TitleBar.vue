<script setup>
import { getCurrentWindow } from "@tauri-apps/api/window"; 

const appWindow = getCurrentWindow();

const toggleMaximize = async () => {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
        await appWindow.unmaximize();
    } else {
        await appWindow.maximize();
    }
};

</script>

<template>
    <div class="h-8 bg-transparent w-full absolute top-0 z-[963] text-center" data-tauri-drag-region @dblclick="toggleMaximize"></div>
</template>
