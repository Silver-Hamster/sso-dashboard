<template>
    <section class="products bg-light py-5">
        <div class="container">
            <div class="text-center py-5">
                <h2 class="fs-1">Our Products</h2>
            </div>
            <div class="row">
                <div v-for="(product, index) in products.data" :key="index" class="col-12 col-md-4 col-lg-4 text-dark">
                    <div>
                        <a :href="`/products/${product.slug}`">
                            <img :src="`${baseUrl}${product.default_image}`" class="img-fluid" :alt="product.name">
                        </a>
                    </div>
                    <div class="pt-4 ps-5">
                        <h4 class="fw-bold">{{ product.name }}</h4>
                        <p v-html="product.description"></p>
                    </div>
                </div>
            </div>
            <div class="text-center py-5">
                <button type="button" class="btn btn-color rounded-1 fw-bold mt-5">Learn More</button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@plugins/axios';
const baseUrl = 'http://localhost:3001/uploads/';

const products = ref([]);

onMounted(async () => {
    try {
        const response = await axiosInstance.get('/products/getProducts');
        products.value = response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
</script>

<style scoped>
.products img {
    border-radius: 0px 61px;
    box-shadow: #00000091 3px 9px 10px 0px;
}

.btn-color {
    background-color: #1B326A;
    color: #fff;
}

h2 {
    color: #1B326A;
}
</style>