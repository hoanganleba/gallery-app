<script setup>
const props = defineProps({
    isOvering: {
        type: Boolean,
        required: true
    }
});
</script>

<template>
    <div class="bg-white/10 z-[369] backdrop-blur-md absolute inset-0 transform transition-opacity duration-300 ease-in-out"
        :class="{ 'opacity-0': !isOvering, 'opacity-100': isOvering }">
    </div>
</template>