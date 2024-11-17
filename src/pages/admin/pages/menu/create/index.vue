<template>
  <v-container>
    <h1>Create Menu</h1>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.slug" label="Slug" :rules="slugRules" required></v-text-field>
      <v-btn :to="{ name: 'AdminMenus' }" color="secondry" class="mr-2">Back</v-btn>
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

const formRef = ref(null);
const form = ref({
  name: '',
  slug: '',
});

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

const submitForm = () => {
  if (!form.value.name || !form.value.slug) {
    showErrorPopup.value = true;
    return;
  }

  try {
    axiosInstance.post('/menus', {
      name: form.value.name,
      slug: form.value.slug,
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
    showErrorPopup.value = true;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    slug: '',
  };
  formRef.value.resetValidation();
};
</script>