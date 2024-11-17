<template>
  <div>
    <div v-if="loading" class="loader">Loading...</div>
    <div v-else>
      <h1>Admin Page</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);

onMounted(() => {
  // Simulate a loading delay
  setTimeout(() => {
    loading.value = false;
  }, 2000); // Adjust the delay as needed
});
</script>

<style>
.loader {
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
}
</style>