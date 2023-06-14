<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import useAuthStore from '../stores/auth-store';
import { type WorkerType } from '../types/WorkerType';
import { BASE_IMAGE_URL, BASE_URL } from '../utils/constantes';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const worker = ref<WorkerType | undefined>();
const isLoading = ref<boolean>(false);
const isLoadingDelete = ref<boolean>(false);
const { isAuthenticated, getToken, logout } = useAuthStore();

onMounted(async () => {
    try {
        const url = `${BASE_URL}/workers/${id}`;
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
            }
        }
    }
    catch(e) {
        console.log(e);
    }
    finally {
        isLoading.value = false;
    }
});

async function handleDelete() {
    try {
        if(!isAuthenticated()) {
            logout();
            router.push('/auth/login');
            return;
        }
        const url = `${BASE_URL}/workers/${id}`;
        isLoadingDelete.value = true;
        const response = await fetch(url, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if(response.status === 204) {
            router.push('/workers');
            return;
        }
        const data = await response.json();
        console.log(data);
    }
    catch(e) {
        console.error(e);
    }
    finally {
        isLoadingDelete.value = false;
    }
}

const imageUrl = computed(() => {
    if(worker.value?.image) {
        return `${BASE_IMAGE_URL}/storage/${worker.value.image}`;
    }
    return './../imgs/worker.png';
})
</script>

<template>
    <div class="container">
        <header class="mb-3 text-center">
            <h1>Worker details</h1>
            <RouterLink class="btn btn-primary" to="/workers">Go Back</RouterLink>
        </header>
        <div v-if="isLoading">
            <h2>Loading...</h2>
        </div>
        <div v-if="!isLoading && worker" class="text-center">
            <div id="image-container">
                <img :src="imageUrl" :alt="worker.first_name" />
            </div>
            <h2 class="mb-3">{{ worker.first_name }} {{ worker.last_name }}</h2>
            <template v-if="isAuthenticated()">
                <RouterLink :to="`/edit-worker/${id}`" class="btn btn-primary me-2">Edit</RouterLink>
                <button 
                @click="() => handleDelete()" 
                class="btn btn-danger"
                :disabled="isLoadingDelete"    
                >
                    <span v-if="isLoadingDelete" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Delete
                    <span v-if="isLoadingDelete">...</span>
                </button>
            </template>
        </div>
    </div>
</template>

<style scoped>
#image-container {
    padding: 20px;
}

#image-container img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 10px solid #CCC;
}
</style>