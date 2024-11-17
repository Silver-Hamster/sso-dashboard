<template>
  <v-container>
    <h1>Edit Menu</h1>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>
      <v-btn :to="{ name: 'AdminMenus' }" color="secondry" class="mr-2 my-5">Back</v-btn>
      <v-btn type="submit" color="primary my-5">Update</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import axiosInstance from '@plugins/axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Make sure you import useRoute

const route = useRoute();
const id = ref(route.params?.id || "");
const form = ref({
  name: '',
  slug: '',
  short_description: '',
  description: '',
  images: [],
});

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
];

const slugRules = [
  (v: string) => !!v || 'Slug is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug must be a valid format',
];

// Function to submit the form
const submitForm = async () => {
  try {
    const response = await axiosInstance.patch(`/menus/${id.value}`, {
      name: form.value.name,
      slug: form.value.slug,
      // Add other fields here if necessary
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Form submitted successfully:', response.data);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

// Function to get menu data by ID
const getMenuByID = async () => {
  try {
    const response = await axiosInstance.get(`menus/edit/${id.value}`);
    if (response.data.data) {
      // Update form values with the fetched data
      form.value.name = response.data.data.name;
      form.value.slug = response.data.data.slug;
      // If you have other fields to populate, add them here
    }
  } catch (error) {
    console.error('Error fetching menu:', error);
  }
}

// Fetch menu data when the component is mounted
onMounted(() => {
  getMenuByID();
});
</script>
