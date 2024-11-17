<template>
  <div>
    <Header />
    <main>
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
  import Header from '../components/Header.vue'; // Updated path
  import Footer from '../components/Footer.vue'; // Updated path
</script>

<style scoped>

</style>
