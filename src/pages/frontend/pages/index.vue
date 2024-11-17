<template>
 <carouselSlide/>
  <ServiceCard/>
  <AboutUs/>
  <Products/>
  <Projects/>
  <Industries/>
  <GetinTouch/>
</template>

<script lang="ts" setup>
import carouselSlide from '../components/carouselSlide.vue';
import ServiceCard from '../components/ServiceCard.vue';
import AboutUs from '../components/Aboutus.vue';
import Products from '../components/Products.vue';
import Projects from '../components/Projects.vue';
import Industries from '../components/Industries.vue';
import GetinTouch from '../components/GetinTouch.vue';

</script>

<style scoped>
h1 {
  color: #fffefe;
}

p {
  font-size: 1.2rem;
  color: #ffffff;
}
</style>