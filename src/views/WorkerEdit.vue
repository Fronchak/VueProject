<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import WorkerForm from '../components/WorkerForm.vue';
import { BASE_URL } from '../utils/constantes';
import { type WorkerType } from '../types/WorkerType';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const worker = ref<WorkerType | undefined>();
const isLoading = ref<boolean>(false);
const url = `${BASE_URL}/workers/${id}`;

onMounted(async () => {
    try {
        isLoading.value = true;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        if(response.ok) {
            worker.value = data;
        }
        else {
            if(response.status === 404) {
                router.push('/workers');
                return;
            }
            console.log(data);
        }
    }
    catch(e) {
        console.error(e);
    }
    finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="container">
        <div class="form-container">
            <header class="mb-3">
                <h1>Edit a Worker</h1>
                <RouterLink class="btn btn-primary" to="/workers">Go Back</RouterLink>
            </header>
            <div v-if="isLoading">
                <h2>Loading...</h2>
            </div>
            <div v-if="!isLoading && worker">
                <WorkerForm 
                    :url="url" 
                    :is-update="true"
                    button-text="Edit" 
                    :first-name="worker.first_name"
                    :last-name="worker.last_name"    
                    :image="worker.image"
                />
            </div>
        </div>
    </div>
</template>