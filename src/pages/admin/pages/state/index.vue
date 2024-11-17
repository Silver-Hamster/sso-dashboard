<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>State</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" class="me-4" label="Search" single-line
                        hide-details></v-text-field>
                    <v-btn class="btn border text-light bg-dark px-2 rounded me-4"
                        :to="{ name: 'AdminStateCreate' }">Create State</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                    <v-btn icon @click="editState(item)" class="mx-2">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteState(item)" class="mx-2">
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
    { title: 'Name', value: 'name' },
    { title: 'Slug', value: 'slug' },
    { title: 'State Code', value: 'code' },
    { title: 'Actions', value: 'actions', sortable: false },
]);

const loading = ref(false);
const router = useRouter();
const items = ref([]);
const search = ref('');

const getState = () => {
    loading.value = true;
    axiosInstance.get('admin/states')
        .then(response => {
            loading.value = false;
            console.log(response.data); // Log the response to inspect the structure
            items.value = response.data; // Ensure this matches the actual response structure
        })
        .catch(error => {
            loading.value = false;
            console.log(error);
        });
};

const editState = (item: { id: any; }) => {
    router.push({ name: 'AdminStateEdit', params: { id: item.id } });
};

const deleteState = (item: { name: any; id: any; }) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        axiosInstance.delete(`admin/states/${item.id}`)
            .then(() => {
                getState();
            })
            .catch(error => {
                console.log(error);
            });
    }
};

onMounted(getState);
</script>