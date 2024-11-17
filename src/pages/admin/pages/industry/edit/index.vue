<template>
  <v-container>
    <h1>Edit Industry</h1>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>

      <v-file-input v-model="form.images" label="Images" :rules="imagesRules" multiple required @change="previewImages"
        @click:clear="previewImages"></v-file-input>


      <v-row class="py-5">
        <v-col v-for="(image, index) in imagePreviews" :key="index" cols="12" sm="6" md="4">
          <v-img :src="image" aspect-ratio="1" class="mb-4"></v-img>
        </v-col>
      </v-row>

      <v-row class="py-5">
        <v-col v-for="(image, index) in uploadedImages" :key="index" cols="12" sm="6" md="4">
          <v-img :src="getImageUrl(image)" aspect-ratio="1" class="mb-4"></v-img>
        </v-col>
      </v-row>

      <v-btn :to="{ name: 'AdminIndustries' }" color="secondary" class="mr-2 my-5">Back</v-btn>
      <v-btn type="submit" color="primary my-5">Update</v-btn>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const showPopup = ref(false);
const showErrorPopup = ref(false);
const route = useRoute();
const id = ref(route.params?.id || "");

const imagePreviews = ref<string[]>([]);
const uploadedImages = ref<string[]>([]);
const form = ref({
  slug: '',
  images: [],
  default_image: null,
});

const slugRules = [
  (v: string) => !!v || 'Slug is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug must be a valid format',
];





const getImageUrl = (image: string) => {
  const baseUrl = 'http://localhost:3001/uploads/';
  return `${baseUrl}${image}`;
};

const submitForm = () => {
  try {
    const formData = new FormData();
    formData.append('slug', form.value.slug);
    form.value.images.forEach((image) => {
      formData.append('images', image);
    });
    if (form.value.default_image) {
      formData.append('default_image', form.value.default_image);
    }

    axiosInstance.patch(`/industries/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log('Form updated successfully:', response.data);
      showPopup.value = true;
    }).catch(error => {
      console.error('Error updating form:', error);
      showErrorPopup.value = true;
    });

  } catch (error) {
    console.error('Error updating form:', error);
  }
};

const previewImages = () => {
  imagePreviews.value = [];
  uploadedImages.value = [];

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

    // Clear uploadedImages if imagePreviews is not empty
    if (imagePreviews.value.length > 0) {
      uploadedImages.value = [];
    }
  }
};

const getIndustryByID = () => {
  axiosInstance.get(`industries/edit/${id.value}`)
    .then(response => {
      form.value.slug = response.data.data.slug;
      uploadedImages.value = response.data.data.images;
    })
    .catch(error => {
      console.log(error);
    });
};

onMounted(() => {
  getIndustryByID();
});
</script>
