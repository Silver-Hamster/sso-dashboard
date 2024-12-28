<template>
  <v-container>
    <h2 class="py-5">Edit Office</h2>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-row>
        <!-- Select State -->
        <v-select v-model="form.states" label="Select State" :items="stateOptions" item-title="name" return-object
          :rules="stateRules" required></v-select>

        <!-- Select City -->
        <v-col cols="12" md="6" lg="6">
          <v-select v-model="form.cities" :label="cityPlaceholder" :items="cityOptions"
            :disabled="!form.states || cityOptions.length === 0" item-value="id" item-title="name" :rules="cityRules"
            required :loading="isLoadingCities"></v-select>
          <!-- <v-progress-circular v-if="isLoadingCities" indeterminate color="primary" class="my-2"></v-progress-circular> -->
        </v-col>

        <!-- Zip Code -->
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.zip_code" label="Zipcode" :rules="zipCodeRules" required></v-text-field>
        </v-col>

        <!-- Phone Number -->
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.phone" label="Phone Number" :rules="phoneRules" required></v-text-field>
        </v-col>

        <!-- Google Rating -->
        <v-col cols="12" md="6" lg="6">
          <v-text-field v-model="form.google_rating" label="Google Rating" :rules="ratingRules" required></v-text-field>
        </v-col>

        <!-- Google Map Code -->
        <v-col cols="12" md="6" lg="6">
          <v-textarea v-model="form.google_maps_code" label="Google Map Code" :rules="googleMapCodeRules"
            required></v-textarea>
        </v-col>

        <!-- Address -->
        <v-col cols="12" md="12" lg="12">
          <v-textarea v-model="form.address" label="Address" :rules="addressRules" required></v-textarea>
        </v-col>
      </v-row>

      <!-- Action Buttons -->
      <v-btn :to="{ name: 'AdminOffices' }" color="secondary" class="mr-2 my-5">Back</v-btn>
      <!-- <v-btn type="submit" color="primary my-5">Update</v-btn> -->
      <v-btn type="submit" :disabled="isSubmitting" color="primary my-5">
        <template v-if="isSubmitting">
          <v-progress-circular indeterminate color="white" size="20"></v-progress-circular>
        </template>
        <template v-else>
          Update
        </template>
      </v-btn>
    </v-form>

    <!-- Success and Error Popups -->
    <v-dialog v-model="showPopup" persistent max-width="300">
      <v-card>
        <v-card-title>Success</v-card-title>
        <v-card-text>Office updated successfully!</v-card-text>
        <v-card-actions>
          <v-btn color="primary"  @click="showPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showErrorPopup" persistent max-width="300">
      <v-card>
        <v-card-title>Error</v-card-title>
        <v-card-text>There was an error updating the office. Please try again.</v-card-text>
        <v-card-actions>
          <v-btn color="primary"  @click="showErrorPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
const cityPlaceholder = computed(() => isLoadingCities.value ? 'Searching...' : 'Select City');

import router from '@/router';
import axiosInstance from '@plugins/axios';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Define interfaces for the form and state
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

// Form state and data
const route = useRoute();
const id = ref(route.params?.id || '');
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

const stateOptions = ref<Array<State>>([]);
const cityOptions = ref<Array<{ id: string; name: string }>>([]);
const isLoadingCities = ref(false);
const showPopup = ref(false);
const showErrorPopup = ref(false);
const isSubmitting = ref(false);


// Fetch states data
const fetchStates = async () => {
  try {
    const response = await axiosInstance.get('/admin/states?page=1&itemsPerPage=100');
    stateOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching states:', error);
  }
};

// Fetch cities for a state
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

// Get office data by ID
const getOfficeByID = async () => {
  try {
    const response = await axiosInstance.get(`/admin/offices/edit/${id.value}`);
    if (response.data) {
      form.value = {
        ...form.value,
        ...response.data,
        states: response.data.states,
      };
      if (form.value.states.code) {
        await fetchCities(form.value.states.code);
        form.value.cities = response.data.city_name.id;
      }
    }
  } catch (error) {
    console.error('Error fetching office:', error);
  }
};

// Submit the form
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const response = await axiosInstance.patch(`/admin/offices/${id.value}`, form.value, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Office updated successfully:', response.data);
    showPopup.value = true;
    router.push({ name: 'AdminOffices' });

    
  } catch (error) {
    console.error('Error updating office:', error);
    showErrorPopup.value = true;
  }finally {
    isSubmitting.value = false;
  }
};


// Watch for state changes
watch(() => form.value.states, (newState) => {
  if (newState?.code) {
    fetchCities(newState.code);
  } else {
    cityOptions.value = [];
  }
});

// Initialize data on component mount
onMounted(async () => {
  await fetchStates();
  await getOfficeByID();
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
</script>
