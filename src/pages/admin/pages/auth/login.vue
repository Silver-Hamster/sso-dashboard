<template>
    <div>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field v-model="email" density="compact" placeholder="Email address"
                prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline" variant="outlined"
                @click:append-inner="visible = !visible"></v-text-field>
            <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="handleLogin">
                Log In
            </v-btn>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosInstance from '@plugins/axios'
import Cookies from 'js-cookie';
import router from '@/router';


const visible = ref(false);
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: email.value,
            password: password.value,
        });
        console.log('Login successful:', response.data);
          // Store the token in cookies
          Cookies.set('accessToken', response.data.access_token
          , { expires: 7 }); // Expires in 7
          Cookies.set('userType', response.data.UserType, { expires: 7 }); // Expires in 7 days
        //   router.push({ name: 'AdminHome' });
          window.location.reload();
          router.push({ name: 'AdminHome' });
          
        // Perform further actions like storing the token or redirecting the user
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        // Handle login failure (e.g., show an error message to the user)
    }
};
</script>
