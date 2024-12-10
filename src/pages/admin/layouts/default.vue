<template>
  <div>
    <Header />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts" setup>
  import Header from '../components/Header.vue'; // Updated path
</script>

<style scoped>
main {
  padding: 2rem;
  min-height: 80vh;
}
</style>
