<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Offices</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" class="me-4" label="Search" single-line
                        hide-details></v-text-field>
                    <v-btn class="btn border text-light bg-dark px-2 rounded me-4"
                        :to="{ name: 'AdminOfficesCreate' }">Create office</v-btn>
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
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axiosInstance from '@plugins/axios';
import { useRouter } from 'vue-router';

const headers = ref([
    { title: 'States', value: 'states.name' },
    { title: 'Cities', value: 'city_name.name' },
    { title: 'Address', value: 'address' },
    { title: 'Zip Code', value: 'zip_code' },
    { title: 'Phone', value: 'phone' },
    { title: 'Google Maps Code', value: 'google_maps_code' },
    { title: 'Google Rating', value: 'google_rating' },
    { title: 'Actions', value: 'actions', sortable: false },
]);

const loading = ref(false);
const router = useRouter();
const items = ref([]);
const search = ref('');

const getOffice = () => {
    loading.value = true;
    axiosInstance.get('admin/offices')
        .then(response => {
            loading.value = false;
            // Log the response to inspect the structure
            items.value = response.data; // Ensure this matches the actual response structure
        })
        .catch(error => {
            loading.value = false;
            console.log(error);
        });
};

const editOffice = (item: { id: any; }) => {
    router.push({ name: 'AdminOfficesEdit', params: { id: item.id } });
};

const deleteOffice = (item: { name: any; id: any; }) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        axiosInstance.delete(`admin/offices/${item.id}`)
            .then(() => {
                getOffice();
            })
            .catch(error => {
                console.log(error);
            });
    }
};

onMounted(getOffice);
</script>