<template>
  <v-container>
    <h1>Edit Banner</h1>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="form.title" label="Title" :rules="titleRules" required></v-text-field>

      <v-text-field v-model="form.subtitle" label="Subtitle" :rules="subtitleRules" required></v-text-field>

      <v-text-field v-model="form.Order_By" label="Order_By" :rules="Order_ByRules" required></v-text-field>

      <v-text-field v-model="form.button_text" label="Button text" :rules="button_textRules" required></v-text-field>
      <v-text-field v-model="form.button_url" label="Button url" :rules="button_urlRules" required></v-text-field>

      <v-file-input v-model="form.background_images" label="Background images" :rules="background_imagesRules" multiple
        required @change="previewImages" @click:clear="previewImages"></v-file-input>
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
      <v-btn :to="{ name: 'AdminBanners' }" color="secondry" class="mr-2 my-5">Back</v-btn>
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
import { ref } from 'vue';

const route = useRoute();
const id = ref(route.params?.id || "");
const imagePreviews = ref<string[]>([]);
const uploadedImages = ref<string[]>([]);
  const showPopup = ref(false);
  const showErrorPopup = ref(false);
const form = ref({
  title: '',
  subtitle: '',
  Order_By: '',
  button_text: '',
  button_url: '',
  background_images: [],
});

const titleRules = [
  (v: string) => !!v || 'Title is required',
  (v: string) => v.length <= 50 || 'Title must be less than 80 characters',
];

const button_urlRules = [
  (v: string) => !!v || 'Button Url is required',
  (v: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Button Url  must be a valid format',
];
const Order_ByRules = [
  (v: string) => !!v || 'Order By is required',
  (v: string) => Number.isInteger(Number(v)) || 'Order By must be an integer',
];
const button_textRules = [
  (v: string) => !!v || 'Button Text is required',
  (v: string) => v.length <= 50 || 'Button Text must be less than 80 characters',
];

const subtitleRules = [
  (v: string) => !!v || 'Subtitle is required',
  (v: string) => v.length <= 100 || 'Subtitle must be less than 100 characters',
];

const getImageUrl = (image: string) => {
  const baseUrl = 'http://localhost:3001/uploads/';
  return `${baseUrl}${image}`;
};

const submitForm = () => {
  try {
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('subtitle', form.value.subtitle);
    formData.append('Order_By', form.value.Order_By);
    formData.append('button_text', form.value.button_text);
    formData.append('button_url', form.value.button_url);
    form.value.background_images.forEach((background_images, index) => {
      formData.append(`background_images`, background_images);
    });

    axiosInstance.patch(`/banners/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      console.log('Form submitted successfully:', response.data);
      showPopup.value = true;
    }).catch(error => {
      console.error('Error submitting form:', error);
      showErrorPopup.value = true;
    });

  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const previewImages = () => {
  imagePreviews.value = [];
  uploadedImages.value = [];

  if (form.value.background_images) {
    Array.from(form.value.background_images).forEach((file: File) => {
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

const getProductByID = () => {
  axiosInstance.get(`banners/edit/${id.value}`)
    .then(response => {
      form.value.title = response.data.data.title;
      form.value.subtitle = response.data.data.subtitle;
      form.value.Order_By = response.data.data.Order_By;
      form.value.button_text = response.data.data.button_text;
      form.value.button_url = response.data.data.button_url;
      uploadedImages.value = response.data.data.background_images;
    })
    .catch(error => {
      console.log(error);
    });
}

onMounted(() => {
  getProductByID();
});
</script>