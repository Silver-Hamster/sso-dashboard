<template>
  <v-container class="mb-5">
    <h3 class="py-3">Create User</h3>
    <v-form ref="formRef" @submit.prevent="submitForm" class="mb-9">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.email" label="Email" :rules="emailRules" required></v-text-field>
      <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules" :type="show1 ? 'text' : 'password'" hint="At least 8 characters"
        label="Password" name="input-10-1" counter @click:append="show1 = !show1"></v-text-field>
      <v-select v-model="form.user_type_id" label="Select User Type" :items="user_types_Options" item-value="id"
        item-title="name" :rules="userTypeRules" required></v-select>
      <v-btn :to="{ name: 'AdminUsers' }" color="secondry" class="mr-2">Back</v-btn>
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
import { ref,onMounted } from 'vue';

const show1 = ref(false);
const password = ref('');
const formRef = ref(null);
const form = ref({
  name: '',
  email: '',
  password: '',
  user_type_id: '',
});
const showPopup = ref(false);
const showErrorPopup = ref(false);
const user_types_Options = ref<Array<{ id: string; name: string }>>([]);

const fetchStates = async () => {
  try {
    const response = await axiosInstance.get('/admin/user-types');
    user_types_Options.value = response.data;
  } catch (error) {
    console.error('Error fetching user types:', error);
  }
};

onMounted(() => {
  fetchStates();
});

const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
];

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
];

const userTypeRules = [
  (v: string) => !!v || 'User type is required',
];

const submitForm = () => {
  try {
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    formData.append('user_type_id', form.value.user_type_id);
    axiosInstance.post('/admin/users', formData, {}).then(response => {
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
    email: '',
    password: '',
    user_type_id: '',
  };
  formRef.value.resetValidation();
};
</script>