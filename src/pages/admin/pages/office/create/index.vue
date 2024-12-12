<template>
  <v-container>
    <h2 class="py-5">Create Office</h2>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-row>
        <v-select v-model="form.states" label="Select State" :items="stateOptions" item-title="name" return-object
          :rules="stateRules" required></v-select>
        <v-col cols="12" md="6" lg="6">
          <v-select v-model="form.cities" label="Select City" :items="cityOptions"
            :disabled="!form.states || cityOptions.length === 0" item-value="id" item-title="name" :rules="cityRules"
            required></v-select>
          <v-progress-circular v-if="isLoadingCities" indeterminate color="primary" class="my-2"></v-progress-circular>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.zip_code" label="Zipcode" :rules="zipCodeRules" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.phone" label="Phone Number" :rules="phoneRules" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.google_rating" label="Google Rating" :rules="ratingRules" required></v-text-field>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-textarea v-model="form.google_maps_code" label="Google Map Code" :rules="googleMapCodeRules"
            required></v-textarea>
        </v-col>
        <v-col cols="12" md="12" lg="12">
          <v-textarea v-model="form.address" label="Address" :rules="addressRules" required></v-textarea>
        </v-col>
      </v-row>
      <v-btn :to="{ name: 'AdminOffices' }" color="secondary" class="mr-2 my-5">Back</v-btn>
      <v-btn type="submit" :disabled="isSubmitting" color="primary my-5">
        <template v-if="isSubmitting">
          <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
        </template>
        <template v-else>
          Submit
        </template>
      </v-btn> </v-form>
    <!-- Success and Error Dialogs -->
    <!-- ...same as above -->
  </v-container>
</template>

<script lang="ts" setup>
import axiosInstance from '@plugins/axios';
import { ref, onMounted, watch } from 'vue';


interface State {
  id: string;
  name: string;
  code: string;
}

interface Form {
  address: string;
  cities: string;
  states: State;
  zip_code: string;
  phone: string;
  google_rating: string;
  google_maps_code: string;
}

const formRef = ref<null | { validate: () => boolean | Promise<boolean>; resetValidation: () => void; }>(null);
const form = ref<Form>({
  address: '',
  cities: '',
  states: {
    id: '',
    name: '',
    code: '',
  },
  zip_code: '',
  phone: '',
  google_rating: '',
  google_maps_code: '',
});

const stateOptions = ref<Array<{ id: string; name: string; code: string }>>([]);
const cityOptions = ref<Array<{ id: string; name: string }>>([]);
const showPopup = ref(false);
const showErrorPopup = ref(false);
const isLoadingCities = ref(false);
const isSubmitting = ref(false);

const fetchStates = async () => {
  try {
    const response = await axiosInstance.get('/admin/states?page=1&itemsPerPage=100');
    stateOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching states:', error);
  }
};

const fetchCities = async (stateCode: string) => {
  isLoadingCities.value = true;
  try {
    const response = await axiosInstance.get(`/admin/cities?stateCode=${stateCode}&page=1&itemsPerPage=10000`);
    cityOptions.value = response.data.data.map((city: { id: string; name: string }) => ({
      id: city.id,
      name: city.name,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
  } finally {
    isLoadingCities.value = false;
  }
};

watch(() => form.value.states, (newState) => {
  if (newState) {
    fetchCities(newState.code);
  } else {
    cityOptions.value = [];
  }
});

onMounted(() => {
  fetchStates();
});

const stateRules = [(v: string | number) => !!v || 'State is required'];
const cityRules = [(v: string) => !!v || 'City is required'];
const zipCodeRules = [
  (v: string) => !!v || 'Zip code is required',
  (v: string) => /^\d{5}(-\d{4})?$/.test(v) || 'Invalid zip code format',
];
const phoneRules = [
  (v: string) => !!v || 'Phone number is required',
  (v: string) => /^\+?\d{10,15}$/.test(v) || 'Invalid phone number format',
];
const ratingRules = [
  (v: string) => !!v || 'Rating is required',
  (v: string) => /^[1-5](\.\d{1,2})?$/.test(v) || 'Rating must be between 1.0 and 5.0',
];
const googleMapCodeRules = [
  (v: string) => !!v || 'Google Maps code is required',
  (v: string) => v.length <= 500 || 'Google Maps code must be less than 500 characters',
];
const addressRules = [
  (v: string) => !!v || 'Address is required',
  (v: string) => v.length <= 250 || 'Address must be less than 250 characters',
];

const submitForm = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) {
    showErrorPopup.value = true;
    console.error('Validation failed. Form data is incomplete or incorrect.');
    return;
  }

  isSubmitting.value = true;
  try {
    await axiosInstance.post('/admin/offices', { ...form.value });
    resetForm();
    showPopup.value = true;
  } catch (error) {
    console.error('Error submitting form:', error);
    showErrorPopup.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  form.value = {
    address: '',
    cities: '',
    states: {
      id: '',
      name: '',
      code: '',
    },
    zip_code: '',
    phone: '',
    google_rating: '',
    google_maps_code: '',
  };
  formRef.value?.resetValidation();
};
</script>