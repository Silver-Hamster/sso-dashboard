<template>
  <v-container class="mb-5">
    <h3 class="py-3">Edit User</h3>
    <v-form ref="formRef" @submit.prevent="submitForm" class="mb-9">
      <v-text-field v-model="form.name" label="Name" :rules="nameRules" required></v-text-field>
      <v-text-field v-model="form.email" label="Email" :rules="emailRules" required></v-text-field>
      <v-text-field 
        v-model="password" 
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules" 
        :type="show1 ? 'text' : 'password'" 
        hint="At least 8 characters"
        label="Password" 
        name="password" 
        counter 
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-text-field 
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="confrim_passwordRules" 
        :type="show1 ? 'text' : 'password'" 
        hint="At least 8 characters"
        label="Confirm Password" 
        name=" Confirm password" 
        counter 
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-select 
        v-model="form.user_type_id" 
        label="Select User Type" 
        :items="user_types_Options" 
        item-value="id" 
        item-title="name" 
        :rules="userTypeRules" 
        required
      ></v-select>
      <v-btn :to="{ name: 'AdminUsers' }" color="secondry" class="mr-2">Back</v-btn>
      <v-btn type="submit" :disabled="isSubmitting" color="primary " my-5>
        <template v-if="isSubmitting">
          <v-progress-circular indeterminate color="white" size="20" class="px-5"></v-progress-circular>
        </template>
        <template v-else>
          Update
        </template>
      </v-btn>    </v-form>

    <!-- Success Popup -->
    <v-dialog v-model="showPopup" max-width="290">
      <v-card>
        <v-card-title class="headline">Success</v-card-title>
        <v-card-text>User updated successfully!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1"  @click="showPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Error Popup -->
    <v-dialog v-model="showErrorPopup" max-width="290">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>There was an error updating the user. Please try again.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1"  @click="showErrorPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import axiosInstance from '@plugins/axios';
import { ref, onMounted } from 'vue';

const show1 = ref(false);
const password = ref('');
const formRef = ref(null);

const route = useRoute();
const id = ref(route.params?.id || "");

const form = ref({
  name: '',
  email: '',
  password: '',
  user_type_id: '',
});

const showPopup = ref(false);
const showErrorPopup = ref(false);

const user_types_Options = ref<Array<{ id: string; name: string }>>([]);

const fetchUserTypes = async () => {
  try {
    const response = await axiosInstance.get('/admin/user-types');
    user_types_Options.value = response.data;
  } catch (error) {
    console.error('Error fetching user types:', error);
  }
};

const fetchUserDetails = async () => {
  try {
    const response = await axiosInstance.get(`/admin/users/${id.value}`);
    const user = response.data;
    form.value.name = user.name;
    form.value.email = user.email;
    form.value.user_type_id = user.user_type_id;
   // password.value = user.password; // Pre-fill the password field
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
};

onMounted(() => {
  fetchUserTypes();
  fetchUserDetails();
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
  (v: string) => v.length === 0 || v.length >= 8 || 'Password must be at least 8 characters',
];
const confrim_passwordRules = computed(() => [
(v: string) => v.length === 0 || v.length >= 8 || 'Password must be at least 8 characters',
(v: string) => v === password.value || 'Passwords do not match',
]);

const userTypeRules = [
  (v: string) => !!v || 'User type is required',
];

const isSubmitting = ref(false);

const submitForm = async () => {
  // const isValid = await formRef.value?.validate();
  // if (!isValid) {
  //   showErrorPopup.value = true;
  //   console.error('Validation failed. Form data is incomplete or incorrect.');
  //   return;
  // }

  isSubmitting.value = true;
  try {
    const formData = {
      name: form.value.name,
      email: form.value.email,
      user_type_id: form.value.user_type_id,
      ...(password.value && { password: password.value }),
    };
    await axiosInstance.patch(`/admin/users/${id.value}`, formData);
    showPopup.value = true;
  } catch (error) {
    console.error('Error updating user:', error);
    showErrorPopup.value = true;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
