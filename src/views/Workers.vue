<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import WorkerCard from '../components/WorkerCard.vue';
import { type WorkerType } from '../types/WorkerType';
import { BASE_URL } from '../utils/constantes';

const isLoading = ref<boolean>(false);
const workers = ref<Array<WorkerType> | undefined>();

onMounted(async () => {

    try {
        const url = `${BASE_URL}/workers`;
        isLoading.value = true;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        workers.value = data;
    }
    catch(e) {
        console.error(e);
    }
    finally {
        isLoading.value = false;
    }
})

</script>

<template>
    <div class="container">
        <header class="mb-3">
            <h1>Workers</h1>
            <RouterLink class="btn btn-primary" to="/new-worker">Add worker</RouterLink>
        </header>
        <div v-if="isLoading">
            <h2>Loading...</h2>
        </div>
        <div v-if="!isLoading && workers">
            <div v-for="worker in workers" :key="worker.id" class="mb-3">
                <WorkerCard :worker="worker"/>
                <hr />
            </div>
        </div>
    </div>
</template>