<script setup lang="ts">
import { RouterLink} from 'vue-router';
import useAuthStore from '../stores/auth-store';

const { isAuthenticated, getEmail, logout } = useAuthStore();

function onLogout() {
  logout();
}
</script>

<template>
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <RouterLink class="navbar-brand" :to="{ name: 'home' }">Workers</RouterLink>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/workers">Workers</RouterLink>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <template v-if="isAuthenticated()">
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/auth/login">{{ getEmail() }}</RouterLink>
          </li>
          <li class="nav-item">
            <span 
              @click="onLogout" 
              class="nav-link" 
              aria-current="page" 
              >Logout</span>
          </li>
        </template>
        <template v-if="!isAuthenticated()">
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/auth/login">Login</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" aria-current="page" to="/auth/login">Register</RouterLink>
          </li>
        </template>

      </ul>
    </div>
  </div>
</nav>
</template>