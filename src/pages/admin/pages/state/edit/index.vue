<template>
  <v-container>
    <h1>Edit State</h1>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>
      <v-text-field v-model="form.code" label="State code" :rules="codeRules" required></v-text-field>
      <v-btn :to="{ name: 'AdminStates' }" color="secondry" class="mr-2 my-5">Back</v-btn>
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
  code: '',
});

// Validation rules
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
];
const codeRules = [
  (v: string) => !!v || 'State code is required',
  (v: string) => v.length <= 3 || 'State must be less than 3 characters',
];

const slugRules = [
  (v: string) => !!v || 'Slug is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug must be a valid format',
];
watch(() => form.value.name, (newVal) => {
  if (newVal) {
    form.value.slug = newVal
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  } else {
    form.value.slug = '';
  }
});
// Function to submit the form
const submitForm = async () => {
  try {
    const response = await axiosInstance.patch(`/admin/states/${id.value}`, {
      name: form.value.name,
      slug: form.value.slug,
      code: form.value.code,
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
const getStateByID = async () => {
  try {
    const response = await axiosInstance.get(`admin/states/edit/${id.value}`);
    if (response.data) {
      // Update form values with the fetched data
      form.value.name = response.data.name;
      form.value.slug = response.data.slug;
      form.value.code = response.data.code;
      // If you have other fields to populate, add them here
    }
  } catch (error) {
    console.error('Error fetching state:', error);
  }
}

// Fetch menu data when the component is mounted
onMounted(() => {
  getStateByID();
});
</script>
