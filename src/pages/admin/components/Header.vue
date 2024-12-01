<template>
  <header>
    <v-app-bar app color="dark">
      <v-toolbar-title>Admin</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="accessToken">
        <v-btn text :to="{ name: 'AdminHome' }" class="text-white">Dashboard</v-btn>
        <v-btn text :to="{ name: 'AdminOffices' }" class="text-white">Offices</v-btn>
        <v-btn text v-if="userType === 'admin'" :to="{ name: 'AdminUsers' }" class="text-white">Users</v-btn>
        <v-btn text class="text-white" @click="logout">Logout</v-btn>
      </template>
      <v-btn text v-else :to="{ name: 'Adminlogin' }" class="text-white">Login</v-btn>
    </v-app-bar>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import axiosInstance from '@plugins/axios';
import Cookies from 'js-cookie';

const router = useRouter();
const userType = ref(Cookies.get('userType'));
const accessToken = ref(Cookies.get('accessToken'));
console.log('Access Token:', accessToken.value);

console.log('User Type:', userType.value);

const logout = async () => {
  try {
    // Call the logout API
    await axiosInstance.post('auth/logout');

    // Ensure the access token exists before attempting to remove it
    if (accessToken.value) {
       // Remove the access token from cookies
      Cookies.remove('accessToken', { path: '/', secure: true, sameSite: 'Strict' });
      Cookies.remove('userType', { path: '/', secure: true, sameSite: 'Strict' });

      console.log('Access token removed successfully');
    } else {
      console.warn('No access token found in cookies');
    }

    // Redirect to the login page after successful logout
    window.location.reload();
    router.push({ name: 'Adminlogin' });
  } catch (error) {
    // Handle any errors during logout
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>