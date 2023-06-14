<script setup lang="ts">
type Props = {
    wasSubmited: boolean,
    message?: string
};

const props = defineProps<Props>();
</script>

<template>
    <div class="invalid-feedback d-block">
        {{ props.wasSubmited ? props.message : '' }}
    </div>
</template>