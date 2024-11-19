<template>
  <v-container>
    <h2 class="py-5">Create Office</h2>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-row>
        <v-select
            v-model="form.states"
            label="Select State"
            :items="stateOptions"
            item-value="code" 
            item-title="name"
            :rules="stateRules"
            required
          ></v-select>
        <v-col cols="12" md="6" lg="6">
          <v-select v-model="form.cities" label="Select City" :items="cityOptions" :disabled="!form.states"
            item-value="id" 
            item-title="name" 
            :rules="cityRules"
            required
            ></v-select>
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
      <v-btn type="submit" color="primary my-5">Submit</v-btn>
    </v-form>

    <!-- Success and Error Dialogs -->
    <!-- ...same as above -->
  </v-container>
</template>

<script lang="ts" setup>
import axiosInstance from '@plugins/axios';
import { ref, onMounted } from 'vue';

interface Form {
  address: string;
  cities: string;
  states: string;
  zip_code: string;
  phone: string;
  google_rating: string;
  google_maps_code: string;
}

const formRef = ref(null);
const form = ref<Form>({
  address: '',
  cities: '',
  states: '', // Will hold the selected state ID
  zip_code: '',
  phone: '',
  google_rating: '',
  google_maps_code: '',
});

const stateOptions = ref<Array<{ id: string; name: string; code: string }>>([]); // Array to hold state data
const cityOptions = ref<Array<{ id: string; name: string }>>([]); // Array to hold city data
const showPopup = ref(false);
const showErrorPopup = ref(false);

// Fetch states from API
const fetchStates = async () => {
  try {
    const response = await axiosInstance.get('/admin/states');
    // console.log('States fetched successfully:', response.data);
    stateOptions.value = response.data; // Assuming API returns states array
    console.log('States fetched successfully:', stateOptions.value);
  } catch (error) {
    console.error('Error fetching states:', error);
  }
};
// Fetch cities based on selected state code
const fetchCities = async (stateCode: string) => {
  try {
    const response = await axiosInstance.get(`/admin/cities?stateCode=${stateCode}`);
    console.log('stateCode:', stateCode);
    console.log('Cities fetched successfully:', response);
    cityOptions.value = response.data.map((city: { id: string; name: string }) => ({
      id: city.id, // City ID
      name: city.name, // City name to display
    }));
    console.log('Cities fetched successfully:', cityOptions.value);
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
};
watch(() => form.value.states, (newStateCode) => {
  if (newStateCode) {
    fetchCities(newStateCode); // Fetch cities for the selected state
  } else {
    cityOptions.value = []; // Clear cities if no state is selected
  }
});
// Fetch states on component mount
onMounted(() => {
  fetchStates();
});

// Validation rules
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

// Submit form
const submitForm = () => {
  const isValid = formRef.value?.validate();
  if (!isValid) {
    showErrorPopup.value = true;
    console.error('Validation failed. Form data is incomplete or incorrect.');
    return;
  }

  axiosInstance
    .post('/admin/offices', { ...form.value })
    .then((response) => {
      console.log('Form submitted successfully:', response.data);
      resetForm();
      showPopup.value = true;
    })
    .catch((error) => {
      console.error('Error submitting form:', error);
      showErrorPopup.value = true;
    });
};

// Reset form
const resetForm = () => {
  form.value = {
    address: '',
    cities: '',
    states: '',
    zip_code: '',
    phone: '',
    google_rating: '',
    google_maps_code: '',
  };
  formRef.value?.resetValidation();
};
</script>
