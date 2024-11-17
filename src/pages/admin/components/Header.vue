<template>

  <header>
    <v-app-bar app color="dark">
      <v-toolbar-title>Admin</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text :to="{ name: 'AdminHome' }" class="text-white">Dashboard</v-btn>
      <v-btn text :to="{ name: 'AdminMenus' }" class="text-white">Menus</v-btn>
      <v-btn text :to="{ name: 'AdminProducts' }" class="text-white">Products</v-btn>
      <v-btn text :to="{ name: 'Adminprojects' }" class="text-white">Projects</v-btn>
      <v-btn text :to="{ name: 'AdminBanners' }" class="text-white">Banners</v-btn>
      <v-btn text :to="{ name: 'AdminIndustries' }" class="text-white">Industries</v-btn>
    </v-app-bar>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
/* Additional styles if needed */
</style>