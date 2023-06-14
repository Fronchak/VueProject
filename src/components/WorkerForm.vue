<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useAuthStore from '../stores/auth-store';
import FormFeedback from './FormFeedback.vue';
import { isBlank } from '../utils/string-utils';
import { BASE_IMAGE_URL } from '../utils/constantes';

type Props = {
    firstName?: string,
    lastName?: string,
    image?: string,
    url: string,
    buttonText: string,
    isUpdate?: boolean
}

const props = defineProps<Props>();
const router = useRouter();
const { isAuthenticated, getToken, logout } = useAuthStore();

const wasSubmited = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const firstName = ref<string>(props.firstName ?? '');
const lastName = ref<string>(props.lastName ?? '');
const image = ref<File | null>(null);

const firstNameError = ref<string | undefined>();
const lastNameError = ref<string | undefined>();

const firtNameClass = computed(() => firstNameError.value ? 'is-invalid' : '');
const lastNameClass = computed(() => lastNameError.value ? 'is-invalid' : '');

function onFirstNameChange() { 
    firstNameError.value = (firstName.value && !isBlank(firstName.value)) ? undefined : 'First name is required';
}

function onLastNameChange() { 
    lastNameError.value = (lastName.value && !isBlank(lastName.value)) ? undefined : 'Last name is required';
}

function onClick() {
    wasSubmited.value = true;
}

async function handleSubmit() {
    onFirstNameChange();
    onLastNameChange();

    if(isAllValid()) {
        try {
            const formData = new FormData();
            formData.append('first_name', firstName.value);
            formData.append('last_name', lastName.value);
            if(image.value) {
                formData.append('image', image.value);
            }
            if(props.isUpdate) {
                formData.append('_method', 'put');
            }
            if(!isAuthenticated()) {
                logout();
                router.push('/auth/login');
                return;
            }
            isLoading.value = true;
            const response = await fetch(props.url, {
                method: 'post',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const data = await response.json();
            if(response.ok) {
                router.push(`/workers/${data.id}`);
                return;
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

function isAllValid() {
    return firstNameError.value === undefined && lastNameError.value === undefined
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if(files) {
        const file = files.item(0);
        image.value = file;
    }
}

const imageUrl = computed(() => {
    if(image.value) {
        return URL.createObjectURL(image.value);
    }
    return `${BASE_IMAGE_URL}/storage/${props.image}`
})
</script>

<template>
    <div v-if="props.image || image" id="image-container">
        <img :src="imageUrl" id="form-preview-image"  />
    </div>
    <form @submit.prevent="() => handleSubmit()">
        <div class="mb-3">
            <label class="form-label" for="first-name">First name</label>
            <input 
                type="text"
                id="first-name"
                v-model="firstName"
                class="form-control"
                :class="wasSubmited && firtNameClass"
                placeholder="First name"
                @input="() => onFirstNameChange()"
            />
            <FormFeedback 
                :wasSubmited="wasSubmited"
                :message="firstNameError"
            />
        </div>
        <div class="mb-3">
            <label class="form-label" for="last-name">Last name</label>
            <input 
                type="text"
                id="last-name"
                v-model="lastName"
                class="form-control"
                :class="wasSubmited && lastNameClass"
                placeholder="Last name"
                @input="() => onLastNameChange()"
            />
            <FormFeedback 
                :wasSubmited="wasSubmited"
                :message="lastNameError"
            />
        </div>
        <div class="mb-3">
            <label class="form-label" for="image">Image</label>
            <input 
                type="file"
                class="form-control"
                id="image"
                @change="($event) => onFileChange($event)"
            />
        </div>
        <div class="mb-3">
            <button 
                @click="() => onClick()" 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="isLoading"    
            >
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ props.buttonText }}
                <span v-if="isLoading">...</span>
            </button>
        </div>
    </form>
</template>

<style scoped>

#image-container {
    padding: 15px 10px;
    text-align: center;
}

#form-preview-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 10px solid #CCC;
}

</style>