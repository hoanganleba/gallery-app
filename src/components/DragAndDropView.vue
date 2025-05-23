<script setup lang="ts">
interface Props {
    openFolderFnProps: () => void
}

const props = defineProps<Props>()
</script>
<template>
    <div class="h-full w-full flex justify-center items-center">
        <h1 class="text-neutral-300 text-xl font-bold select-none cursor-default">
            Drag and drop your folder here,
            <span class="text-indigo-400 cursor-pointer" @click="props.openFolderFnProps"
                >or click here</span
            >
        </h1>
    </div>
</template>
