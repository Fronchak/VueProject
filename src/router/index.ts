import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Workers from '../views/Workers.vue';
import WorkerRegister from '../views/WorkerRegister.vue';
import WorkerDetails from '../views/WorkerDetails.vue';
import WorkerEdit from '../views/WorkerEdit.vue';
import Auth from '../views/Auth.vue';
import Login from '../views/Login.vue';
import useAuthStore from '@/stores/auth-store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/workers',
      name: 'workers',
      component: Workers
    },
    {
      path: '/new-worker',
      name: 'newWorker',
      component: WorkerRegister,
      meta: { requiresAuth: true }
    },
    {
      path: '/edit-worker/:id',
      name: 'editWorker',
      component: WorkerEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/workers/:id',
      name: 'worker-details',
      component: WorkerDetails
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    }
  ]
});

router.beforeEach((to, from) => {
  if(to.meta.requiresAuth && !useAuthStore().isAuthenticated()) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
});

export default router
