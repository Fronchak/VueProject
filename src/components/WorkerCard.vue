<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { type WorkerType } from '../types/WorkerType';
import { BASE_IMAGE_URL } from '../utils/constantes';

type Props = {
    worker: WorkerType
}

const props = defineProps<Props>();

const imageUrl = computed(() => {
    if(props.worker.image) {
        return `${BASE_IMAGE_URL}/storage/${props.worker.image}`;
    }
    return 'imgs/worker.png';
})
</script>

<template>
    <div class="worker-card">
        <div class="image-container">
            <img :alt="props.worker.first_name" :src="imageUrl"  />
        </div>
        <div>
            <RouterLink :to="`/workers/${props.worker.id}`">{{ props.worker.first_name }} {{ props.worker.last_name }}</RouterLink>
        </div>
    </div>
</template>

<style scoped>
.worker-card {
    display: flex;
    align-items: center;
}

.worker-card img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 20px;
    border: 5px solid #CCC;
}

.worker-card a {
    text-decoration: none;
    font-size: 1.5em;
}
</style>