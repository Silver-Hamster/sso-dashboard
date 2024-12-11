<template>
    <div>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field 
                v-model="email" 
                density="compact" 
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" 
                variant="outlined" 
            ></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field 
                v-model="password" 
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" 
                density="compact" 
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline" 
                variant="outlined" 
                @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-btn 
                class="mb-8" 
                color="blue" 
                size="large" 
                variant="tonal" 
                block 
                @click="handleLogin"
                :disabled="loading"
            >
                <template v-if="loading">
                    <v-progress-circular indeterminate color="white" size="24"></v-progress-circular>
                </template>
                <template v-else>
                    Log In
                </template>
            </v-btn>
        </v-card>

        <!-- Snackbar for messages -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosInstance from '@plugins/axios';
import Cookies from 'js-cookie';
import router from '@/router';

const visible = ref(false);
const email = ref('');
const password = ref('');
const snackbar = ref({
    show: false,
    message: '',
    color: '',
});
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: email.value,
            password: password.value,
        });

        // Display success message
        snackbar.value = {
            show: true,
            message: 'Login successful!',
            color: 'green',
        };

        // Store the token in cookies
        Cookies.set('accessToken', response.data.access_token, { expires: 7 });
        Cookies.set('userType', response.data.UserType, { expires: 7 });

        // Redirect to admin home
        router.push({ name: 'AdminHome' });
        window.location.reload();
    } catch (error) {
        // Display error message
        snackbar.value = {
            show: true,
            message: error.response?.data?.message || 'Login failed! Please check your credentials.',
            color: 'red',
        };
    } finally {
        loading.value = false;
    }
};
</script>