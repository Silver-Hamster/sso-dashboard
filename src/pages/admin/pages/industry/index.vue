<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" :search="search" :loading="loading">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Industries</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" class="me-4" label="Search" single-line
                        hide-details></v-text-field>
                    <v-btn class="btn border text-light bg-dark px-2 rounded me-4" :to="{ name: 'AdminIndustryCreate' }">Create Industry</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                    <v-btn icon @click="editIndustry(item)" class="mx-2">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn> 
                <v-btn icon @click="deleteIndustry(item)" class="mx-2">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                </div>
                
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '@plugins/axios';

const headers = ref([
    { title: 'Slug', value: 'slug' },
    { title: 'Image', value: 'default_image' },
    { title: 'Actions', value: 'actions', sortable: false },
]);

const loading = ref(false);
const router = useRouter();
const items = ref([]);

const search = ref('');

const getIndustries = () => {
    loading.value = true;
    axiosInstance.get('industries')
        .then(response => {
            loading.value = false;
            items.value = response.data.data;
        })
        .catch(error => {
            loading.value = false;
            console.log(error);
        });
};

const editIndustry = (item: { id: any; }) => {
    router.push({ name: 'AdminIndustryEdit', params: { id: item.id } });
};

const deleteIndustry = (item: { id: any; }) => {
    if (confirm(`Are you sure you want to delete this industry?`)) {
        axiosInstance.delete(`industries/${item.id}`)
            .then(() => {
                getIndustries(); // Refresh the industry list
            })
            .catch(error => {
                console.log(error);
            });
    }
};

onMounted(getIndustries);
</script>
