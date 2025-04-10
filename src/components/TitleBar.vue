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
    <div class="h-4 bg-transparent w-full absolute z-[369]" data-tauri-drag-region @dblclick="toggleMaximize"></div>
</template>
