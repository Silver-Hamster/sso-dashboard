<template>
  <footer>
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div v-for="section in footerSections" :key="section.title" :class="['col-4 col-md-6 col-lg-3', { 'col-7 col-md-6' : section.contacts,'col-5': section.title === 'Products' },]">
            <h4 class="pb-2 text-start">{{ section.title }}</h4>
            <ul v-if="section.items" class="text-dark list-unstyled text-start">
              <li v-for="item in section.items" :key="item" class="py-1">
                <template v-if="section.title !== 'About US'">
                  <i class="fa-solid fa-greater-than text-light bg-dark rounded-circle me-2 greater-icon"></i>
                </template>
                <span>{{ item }}</span>
              </li>
            </ul>
            <ul v-if="section.contacts" class="list-unstyled text-dark text-start">
              <li v-for="contact in section.contacts" :key="contact.text" class="d-flex align-items-center py-2">
                <i :class="contact.icon + ' me-3'"></i>
                <span>{{ contact.text }}</span>
              </li>
            </ul>
            <div v-if="section.socialMedia" class="social-media-icons text-center">
              <a v-for="social in section.socialMedia" :key="social.platform" :href="social.link"
                class="px-3 my-2 rounded" target="_blank" rel="noopener noreferrer">
                <i :class="social.icon"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axiosInstance from '@plugins/axios';

const navItems = ref<string[]>([]);
const projectsItems = ref<string[]>([]);
const productsItems = ref<string[]>([]);

const fetchMenuItems = async () => {
  try {
    const response = await axiosInstance.get('/menus');
    navItems.value = response.data.map(item => item.name); // Assuming each item has a 'name' property
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
};

const fetchProjectItems = async () => {
  try {
    const response = await axiosInstance.get('/projects/get-projects');
    console.log('Projects response data:', response.data); // Log the response data
    if (response.data && Array.isArray(response.data.data)) {
      projectsItems.value = response.data.data.map(project => project.name);
    } else {
      projectsItems.value = [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const fetchProductsItems = async () => {
  try {
    const response = await axiosInstance.get('/products/getProducts');
    console.log('products response data:', response.data); // Log the response data
    if (response.data && Array.isArray(response.data.data)) {
      productsItems.value = response.data.data.map(products => products.name);
    } else {
      productsItems.value = [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};


onMounted(() => {
  fetchMenuItems();
  fetchProjectItems();
  fetchProductsItems();
});

const footerSections = computed(() => [
  // {
  //   title: 'About US',
  //   items: [
  //     'We are an EPC-based organization that provides engineering services from feasibility studies to designing the world\'s most advanced industrial engineering'
  //   ]
  // },
  {
    title: 'Quick Links',
    items: navItems.value
  },
  {
    title: 'Products',
    items: productsItems.value
  },
  {
    title: 'Projects',
    items: projectsItems.value
  },
  {
    title: 'Contact Us',
    contacts: [
      { icon: 'fas fa-phone-alt', text: '+91 93501-40037' },
      { icon: 'fas fa-envelope', text: 'Sales@mksindustrialsolutions.com' },
      { icon: 'fas fa-map-marker-alt', text: 'Manana Road Samalkha, Panipat, Haryana, India, 132103' }
    ],
    socialMedia: [
      { platform: 'Facebook', link: 'https://www.facebook.com', icon: 'fab fa-facebook-f' },
      { platform: 'Twitter', link: 'https://www.twitter.com', icon: 'fab fa-twitter' },
      { platform: 'Instagram', link: 'https://www.instagram.com', icon: 'fab fa-instagram' },
      { platform: 'LinkedIn', link: 'https://www.linkedin.com', icon: 'fab fa-linkedin-in' }
    ]
  }
]);
</script>

<style scoped>
.social-media-icons {
  display: flex;
  gap: 10px;
}

h4 {
  color: #1B326A;
}

.social-media-icons a {
  border: 1px solid #0073e6;
  background-color: #0073e6;
  color: #fff;
  font-size: 24px;
  text-decoration: none;
}

.social-media-icons a:hover {
  color: #000 !important;
}

.greater-icon {
  padding: 5px;
  font-size: 10px;
}

footer {
  background-color: #ffffff;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  position: relative;
  width: 100%;
  bottom: 0;
}
</style>