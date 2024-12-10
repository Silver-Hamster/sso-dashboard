<template>
    <v-container>
      <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="pagination.totalItems"
        :loading="loading"
        v-model:items-per-page="pagination.itemsPerPage"
        v-model:page="pagination.page"
        @update:options="getOffices"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Offices</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              class="me-4"
              single-line
              hide-details
              @change="getOffices"
            ></v-text-field>
            <v-btn
              class="btn border text-light bg-dark px-2 rounded me-4"
              :to="{ name: 'AdminOfficesCreate' }"
            >
              Create Office
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.google_maps_code="{ item }">
          <v-icon v-if="item.google_maps_code">mdi-map-marker</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn icon @click="editOffice(item)" class="mx-2">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteOffice(item)" class="mx-2">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axiosInstance from "@plugins/axios";
  interface Office {
  id: number;
  states: { name: string };
  city_name: { name: string };
  address: string;
  zip_code: string;
  phone: string;
  google_maps_code: string;
  google_rating: number;
}
  // Reactive data
  const headers = ref([
    { title: "States", key: "states.name" },
    { title: "Cities", key: "city_name.name" },
    { title: "Address", key: "address" },
    { title: "Zip Code", key: "zip_code" },
    { title: "Phone", key: "phone" },
    { title: "Google Maps Code", key: "google_maps_code" },
    { title: "Google Rating", key: "google_rating" },
    { title: "Actions", key: "actions", sortable: false },
  ]);
  
  const items = ref<Office[]>([]);
    const loading = ref(false);
  const search = ref("");
  const pagination = ref({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  
  const router = useRouter();
  
  // API Methods
  const getOffices = ({ page = pagination.value.page, itemsPerPage = pagination.value.itemsPerPage } = {}) => {
    loading.value = true;
    axiosInstance
      .get("admin/offices", {
        params: {
          page,
          itemsPerPage,
          search: search.value,
        },
      })
      .then(({ data }) => {
        items.value = data.data; // Match backend response structure
        pagination.value.totalItems = data.totalItems; // Total item count from backend
        loading.value = false;
      })
      .catch((error) => {
        loading.value = false;
        console.error("Error fetching offices:", error);
      });
  };
  
  const editOffice = (item: { id: any }) => {
    router.push({ name: "AdminOfficesEdit", params: { id: item.id } });
  };
  
  const deleteOffice = (item: {id: any }) => {
    if (confirm(`Are you sure you want to delete ?`)) {
      axiosInstance
        .delete(`admin/offices/${item.id}`)
        .then(() => getOffices())
        .catch((error) => console.error("Error deleting office:", error));
    }
  };
  
  // Lifecycle Hooks
  onMounted(() => getOffices());
  </script>
  