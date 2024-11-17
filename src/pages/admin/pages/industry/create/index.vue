<template>
  <v-container>
    <h1>Create Industry</h1>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>

      <v-file-input v-model="form.images" label="Images" :rules="imagesRules" multiple required @change="previewImages"
        @click:clear="previewImages"></v-file-input>


      <v-row class="py-5">
        <v-col v-for="(image, index) in imagePreviews" :key="index" cols="12" sm="6" md="4">
          <v-img :src="image" aspect-ratio="1" class="mb-4"></v-img>
        </v-col>
      </v-row>

      <v-btn :to="{ name: 'AdminIndustries' }" color="secondary" class="mr-2">Back</v-btn>
      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
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
import { ref } from 'vue';
const showPopup = ref(false);
const showErrorPopup = ref(false);
const formRef = ref(null);
const form = ref({
  slug: '',
  images: [],
  default_image: null,
});

const imagePreviews = ref<string[]>([]);

const slugRules = [
  (v: string) => !!v || 'Slug is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug must be a valid format',
];

const imagesRules = [
  (v: File[]) => v.length > 0 || 'At least one image is required',
];

const defaultImageRules = [
  (v: File) => !!v || 'Default image is required',
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

const submitForm = () => {
  try {
    const formData = new FormData();
    formData.append('slug', form.value.slug);
    form.value.images.forEach((image, index) => {
      formData.append('images', image);
    });
    if (form.value.default_image) {
      formData.append('default_image', form.value.default_image);
    }

    axiosInstance.post('/industries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log('Form submitted successfully:', response.data);
      resetForm();
      showPopup.value = true;
    }).catch(error => {
      console.error('Error submitting form:', error);
      showErrorPopup.value = true;
    });

  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const resetForm = () => {
  form.value = {
    slug: '',
    images: [],
    default_image: null,
  };
  formRef.value.resetValidation();
};
</script>
