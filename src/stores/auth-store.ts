import { ref, onMounted } from 'vue';
import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { KEY_LOCA_STORAGE } from '../utils/constantes';

type TokenDataType = {
    exp: number;
    email: string
}

const useAuthStore = defineStore('auth', () => {
    const email = ref<string | undefined>();
    const token = ref<string | undefined>();

    const isAuthenticated = () => {
        if(!token.value) return false;
        const decoded = jwtDecode(token.value);
        if(!decoded) return false;
        return (decoded as TokenDataType).exp > (Date.now() / 1000);
    }

    const authenticate = (newToken: string, newEmail: string) => {
        localStorage.setItem(KEY_LOCA_STORAGE, JSON.stringify({
            token: newToken, 
            email: newEmail
        }));
        token.value = newToken;
        email.value = newEmail;
    }

    const logout = () => {
        localStorage.removeItem(KEY_LOCA_STORAGE);
        token.value = undefined;
        email.value = undefined;
    }

    const getEmail = () => email.value;

    const getToken = () => token.value;

    onMounted(() => {
        const localStorageData = localStorage.getItem(KEY_LOCA_STORAGE);
        if(localStorageData) {
            const jsonData = JSON.parse(localStorageData) as {
                token: string,
                email: string
            } ;
            token.value = jsonData.token;
            email.value = jsonData.email;
        }
    })
    
    return { getEmail, getToken, isAuthenticated, authenticate, logout }
});

export default useAuthStore;