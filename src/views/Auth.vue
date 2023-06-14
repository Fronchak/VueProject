<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="container">
        <div id="auth-container">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped>
.container {
    min-height: 75vh;
    display: flex;
    align-items: center;
}

#auth-container {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    padding: 60px 20px;
    border-radius: 20px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
    border: 1px solid #CCC;
}
</style>