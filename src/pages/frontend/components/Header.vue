<template>
  <div class="py-3 top-nav">
    <nav class="container">
      <div class="text-end">
        <PopupForm />
      </div>
    </nav>
  </div>
  <nav class="navbar navbar-expand-sm main-nav">
    <div class="container">
      <a class="navbar-brand" href="#"><img src="../../../assets/MKS 3d Logo 500x500 (1).jpg" alt=""></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-5">
          <li v-for="(item, index) in navItems" :key="index" class="nav-item px-2">
            <a class="nav-link active" :href="`${item.slug}`"><b>{{ item.name }}</b></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import PopupForm from './PopupForm.vue';
import axiosInstance from '@plugins/axios';

// Define the interface for the navigation items
interface NavItem {
  slug: string;
  name: string;
}

// Initialize navItems as a ref with the correct type
const navItems = ref<NavItem[]>([]);

const fetchMenuItems = async () => {
  try {
    const response = await axiosInstance.get('/menus');
    navItems.value = response.data; // Assuming the API returns an array of NavItem objects
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
};

onMounted(() => {
  fetchMenuItems();
});
</script>

<style scoped>
.top-nav {
  background-color: #1B326A;
}

.main-nav {
  background-color: #FFFFFF;
}

.main-nav img {
  width: 100px;
  height: 100px;
}

/* Additional styles if needed */
</style>