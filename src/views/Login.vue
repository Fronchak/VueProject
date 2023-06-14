<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import jwtDecode from 'jwt-decode';
import FormFeedback from '../components/FormFeedback.vue';
import useAuthStore from '../stores/auth-store';
import { BASE_URL } from '../utils/constantes';
import { isBlank, isEmail } from '../utils/string-utils';

type TokenDataType = {
    email: string
}

const { authenticate } = useAuthStore();
const router = useRouter();
const route = useRoute();
const email = ref<string>('');
const password = ref<string>('');
const wasSubmited = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const error = ref<string | undefined>();

const emailError = ref<string | undefined>();
const passwordError = ref<string | undefined>();

const emailClass = computed(() => emailError.value ? 'is-invalid' : '');
const passwordClass = computed(() => passwordError.value ? 'is-invalid' : '');

function onClick() {
    wasSubmited.value = true;
}

function onEmailChange() {
    if(!email.value || isBlank(email.value)) {
        emailError.value = 'Email is required';
    }
    else if(!isEmail(email.value)) {
        emailError.value = 'Invalid email';
    }
    else {
        emailError.value = undefined;
    }
}

function onPasswordChange() {
    if(!password.value || isBlank(password.value)) {
        passwordError.value = 'Password is required';
    }
    else if(password.value.length < 6) {
        passwordError.value = 'Password must have at least 6 characteres';
    }
    else {
        passwordError.value = undefined;
    }
}

async function handleSubmit() {
    onEmailChange();
    onPasswordChange();
    if(!emailError.value && !passwordError.value) {
        const body = JSON.stringify({
            email: email.value,
            password: password.value
        });
        isLoading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                body,
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log(response.status);
            const data = await response.json();
            if(response.status === 401) {
                error.value = data.message;
                setTimeout(() => {
                    error.value = undefined;
                }, 3000)
            }
            else if(response.ok) {
                const token = data.access_token;
                const decoded = jwtDecode(token);
                if(decoded) {
                    const tokenData = (decoded as TokenDataType);
                    authenticate(token, tokenData.email);
                    const redirect = route.query.redirect || '/workers';
                    router.push({ path: redirect as string });
                } 
            }
            console.log(data);
        }
        catch(e) {
            console.error(e);
        }
        finally {
            isLoading.value = false;
        }
    }
}

</script>

<template>
    <header class="mb-3">
        <h1>Login</h1>
    </header>
    <div class="alert alert-danger" role="alert" v-if="error">
        {{ error }}
    </div>
    <form @submit.prevent="handleSubmit">
        <div class="mb-3">
            <label class="form-label" for="email">Email</label>
            <input 
                type="email"
                id="email"
                class="form-control"
                :class="wasSubmited && emailClass"
                placeholder="Enter with your email"
                @input="onEmailChange"
                v-model="email"
            />
            <FormFeedback 
                :wasSubmited="wasSubmited"
                :message="emailError"
            />
        </div>
        <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input 
                type="password"
                id="password"
                class="form-control"
                :class="wasSubmited && passwordClass"
                placeholder="Enter with your password"
                @input="onPasswordChange"
                v-model="password"
            />
            <FormFeedback 
                :wasSubmited="wasSubmited"
                :message="passwordError"
            />
        </div>
        <div class="mb-3">
            <button 
                @click="onClick" 
                class="btn btn-primary w-100"
                :disabled="isLoading"     
            >
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Login
                <span v-if="isLoading">...</span>
            </button>
        </div>
    </form>
    <p>Doesn't have an account yet? <RouterLink to="auth/register">Click here</RouterLink> to register</p>
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>