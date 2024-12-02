<template>
  <v-container>
    <v-data-table-server
      :headers="headers"
      :items="items"
:search="searchQuery"
      :items-length="pagination.totalItems"
      :loading="loading"
      v-model:items-per-page="pagination.itemsPerPage"
      v-model:page="pagination.page"
      @update:options="getUser"
      item-value="name"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>User</v-toolbar-title>
          <v-divider class="mx-2" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            label="Search"
            class="me-4"
            single-line
            hide-details
            @change="getUser"
          ></v-text-field>
          <v-btn
            class="btn border text-light bg-dark px-2 rounded me-4"
            :to="{ name: 'AdminUserCreate' }"
          >
            Create User
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <v-btn icon @click="editUser(item)" class="mx-2">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteUser(item)" class="mx-2">
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

// Reactive data
const headers = ref([
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "User Type", key: "user_type.name" },
  { title: "Actions", key: "actions", sortable: false },
]);

const items = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const pagination = ref({
  page: 1,
  itemsPerPage: 10,
  totalItems: 0,
});

const router = useRouter();

// API Methods
const getUser = ({ page = pagination.value.page, itemsPerPage = pagination.value.itemsPerPage } = {}) => {
  loading.value = true;
  axiosInstance
    .get("admin/users", {
      params: {
        page,
        itemsPerPage,
        search: searchQuery.value,
      },
    })
    .then(({ data }) => {
      items.value = data.data; // Backend response structure
      pagination.value.totalItems = data.totalItems; // Total item count from backend
      loading.value = false;
    })
    .catch((error) => {
      loading.value = false;
      console.error("Error fetching users:", error);
    });
};

const editUser = (item: { id: any }) => {
  router.push({ name: "AdminUserEdit", params: { id: item.id } });
};

const deleteUser = (item: { name: string; id: any }) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    axiosInstance
      .delete(`admin/users/${item.id}`)
      .then(() => getUser())
      .catch((error) => console.error("Error deleting user:", error));
  }
};

// Lifecycle Hooks
onMounted(() => getUser());
</script>
