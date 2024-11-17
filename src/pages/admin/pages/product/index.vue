<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Products</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" class="me-4" single-line
                        hide-details></v-text-field>
                    <v-btn class="btn border text-light bg-dark px-2 rounded me-4" :to="{ name: 'AdminProductCreate' }">Create Product</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                    <v-btn icon @click="editProduct(item)" class="mx-2">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteProduct(item)" class="mx-2">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                </div>
                
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axiosInstance from '@plugins/axios'
const headers = ref([
    { title: 'Name', value: 'name' },
    { title: 'Slug', value: 'slug' },
    { title: 'Sort Description', value: 'short_description' },
    { title: 'Long Description', value: 'description' },
    // { title: 'Images', value: 'images' },
    { title: 'Actions', value: 'actions', sortable: false },
]);

const loading = ref(false);
const router = useRouter();
const items = ref([]);

const search = ref('');

const getProduct = () => {
    loading.value = true;
    axiosInstance.get('products')
        .then(response => {
            loading.value = false;
            items.value = response.data.data;
        })
        .catch(error => {
            loading.value = false;
            console.log(error);
        });
}
const editProduct = (item: { id: any; }) => {
    // Navigate to the edit page with the product ID
    // Assuming you have a route named 'AdminProductEdit' that takes an 'id' parameter
    router.push({ name: 'AdminProductEdit', params: { id: item.id } });
};

const deleteProduct = (item: { name: any; id: any; }) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        axiosInstance.delete(`products/${item.id}`)
            .then(() => {
                getProduct(); // Refresh the product list
            })
            .catch(error => {
                console.log(error);
            });
    }
};

onMounted(getProduct);
</script>