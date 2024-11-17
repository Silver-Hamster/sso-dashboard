<template>
    <section class="projects py-5">
        <div class="container">
            <div class="text-center py-5">
                <h2 class="fs-1">Our Projects</h2>
            </div>
            <div class="row">
                <div v-for="(project, index) in projects.data" :key="index" class="col-12 col-md-4 col-lg-4 text-light">
                    <div>
                        <a :href="`/products/${project.slug}`">
                            <img :src="`${baseUrl}${project.default_image}`" class="img-fluid" :alt="project.name || 'Project Image'">
                        </a>
                    </div>
                    <div class="pt-4 ps-5">
                        <h4 class="fw-bold">{{ project.name }}</h4>
                        <p>{{ project.description }}</p>
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
const projects = ref([]);

const fetchProjects = async () => {
    try {
        const response = await axiosInstance.get('/projects/get-projects');
        projects.value = response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};

onMounted(fetchProjects);
</script>

<style scoped>
.projects {
    background-color: #1B326A;
}

.projects img {
    border-radius: 0px 61px;
    box-shadow: #00000091 3px 9px 10px 0px;
}

.btn-color {
    background-color: #ffff;
    color: #1B326A;
}

h2 {
    color: #ffff;
}
</style>