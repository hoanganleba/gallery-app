<script setup lang="ts">
interface Props {
    isOvering: boolean;
}

const props = defineProps<Props>();
</script>

<template>
    <div
        class="bg-white/10 z-[369] backdrop-blur-md absolute inset-0 transform transition-opacity duration-300 ease-in-out"
        :class="{ 'opacity-0': !props.isOvering, 'opacity-100': props.isOvering }"
    >
    </div>
</template>