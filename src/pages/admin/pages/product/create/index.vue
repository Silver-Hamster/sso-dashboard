<template>
  <v-container class="mb-5">
    <h1 py-2>Create Product</h1>
    <v-form ref="formRef" @submit.prevent="submitForm" class="mb-9">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>
      <v-text-field v-model="form.short_description" label="Sort Description" :rules="sortDescriptionRules" required></v-text-field>
      <v-textarea v-model="form.description" label="Long Description" :rules="longDescriptionRules" required></v-textarea>
      <v-file-input v-model="form.images" label="Images" :rules="imagesRules" multiple required @change="previewImages" @click:clear="previewImages"></v-file-input>
      <v-row class="py-5">
        <v-col v-for="(image, index) in imagePreviews" :key="index" cols="12" sm="6" md="4">
          <v-img :src="image" aspect-ratio="1" class="mb-4"></v-img>
        </v-col>
      </v-row>
      <v-btn :to="{ name: 'AdminProducts' }" color="secondry" class="mr-2">Back</v-btn>
      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>

    <!-- Success Popup -->
    <v-dialog v-model="showPopup" max-width="290">
      <v-card>
        <v-card-title class="headline">Success</v-card-title>
        <v-card-text>Form submitted successfully!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Popup -->
    <v-dialog v-model="showErrorPopup" max-width="290">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>There was an error submitting the form. Please try again.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="showErrorPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import axiosInstance from '@plugins/axios';
import { ref, watch } from 'vue';

const formRef = ref(null);
const form = ref({
  name: '',
  slug: '',
  short_description: '',
  description: '',
  images: [],
});
const imagePreviews = ref<string[]>([]);
const showPopup = ref(false);
const showErrorPopup = ref(false);

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
];

const slugRules = [
  (v: string) => !!v || 'Slug is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug must be a valid format',
];

const sortDescriptionRules = [
  (v: string) => !!v || 'Sort Description is required',
  (v: string) => v.length <= 100 || 'Sort Description must be less than 100 characters',
];

const longDescriptionRules = [
  (v: string) => !!v || 'Long Description is required',
];

const imagesRules = [
  (v: File[]) => v.length > 0 || 'At least one image is required',
];

const previewImages = () => {
  imagePreviews.value = [];
  if (form.value.images) {
    Array.from(form.value.images).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          imagePreviews.value.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

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

const submitForm = () => {
  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('slug', form.value.slug);
    formData.append('short_description', form.value.short_description);
    formData.append('description', form.value.description);
    form.value.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    axiosInstance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log('Form submitted successfully:', response.data);
      showPopup.value = true;
      resetForm();
    }).catch(error => {
      console.error('Error submitting form:', error);
      showErrorPopup.value = true;
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    showErrorPopup.value = true;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    slug: '',
    short_description: '',
    description: '',
    images: [],
  };
  formRef.value.resetValidation();
};
</script>