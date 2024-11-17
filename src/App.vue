<template>
  <v-app>
    <v-main>
      <component :is="currentLayout" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import FrontendLayout from './pages/frontend/layouts/default.vue';
import AdminLayout from './pages/admin/layouts/default.vue';

// Get the current route
const route = useRoute();

// Determine the layout based on the route
const currentLayout = computed(() => {
  return route.path.startsWith('/admin') ? AdminLayout : FrontendLayout;
});
</script>
