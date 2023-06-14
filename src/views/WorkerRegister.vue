<script setup lang="ts">
import { RouterLink } from 'vue-router';
import WorkerForm from '../components/WorkerForm.vue';
import { BASE_URL } from '../utils/constantes';
</script>

<template>
    <div class="container">
        <div class="form-container">
            <header class="mb-3">
                <h1>Register a new Worker</h1>
                <RouterLink class="btn btn-primary" to="/workers">Go Back</RouterLink>
            </header>
            <div>
                <WorkerForm :url="`${BASE_URL}/workers`" button-text="Register" />
            </div>
        </div>
    </div>
</template>