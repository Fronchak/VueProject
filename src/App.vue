<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <Navbar></Navbar>
  <div class="py-3" id="main-container">
    <RouterView />
  </div>
  <Footer></Footer>
</template>

<style scoped>
#main-container {
  min-height: 75vh;
}
</style>