<template>
    <section class="bg-white py-5">
        <div class="text-center py-5">
            <h2 class="fs-1">Industries We Serve</h2>
        </div>
        <v-container>
            <v-sheet class="mx-auto" theme="light" color="white">
                <v-slide-group v-model="model" class="pa-4" selected-class="bg-primary" show-arrows :max="4">
                    <v-slide-group-item v-for="(industry, index) in repeatedIndustries" :key="index"
                        v-slot="{ isSelected, toggle, selectedClass }">
                        <v-card class="mx-4 rounded-4" color="grey-lighten-1" height="200" width="220">
                            <v-img :src="baseUrl + industry.default_image" cover :aspect-ratio="1"></v-img>
                        </v-card>
                    </v-slide-group-item>
                </v-slide-group>

                <v-expand-transition>
                    <v-sheet v-if="model != null" height="200">
                        <div class="d-flex fill-height align-center justify-center">
                            <h3 class="text-h6">
                                Selected {{ model }}
                            </h3>
                        </div>
                    </v-sheet>
                </v-expand-transition>
            </v-sheet>
        </v-container>
    </section>
</template>

<script>
import axiosInstance from '@plugins/axios';

export default {
    data: () => ({
        model: null,
        industries: [],
        baseUrl: 'http://localhost:3001/uploads/',
        repeatCount: 110, // Number of times to repeat the industries
    }),
    created() {
        this.fetchIndustries();
    },
    methods: {
        async fetchIndustries() {
            try {
                const response = await axiosInstance.get('/industries');
                this.industries = response.data;
            } catch (error) {
                console.error('Error fetching industries:', error);
            }
        },
    },
    computed: {
        repeatedIndustries() {
            // Repeat the industries array based on repeatCount
            if (this.industries.data && this.industries.data.length > 0) {
                return Array.from({ length: this.repeatCount }, () => this.industries.data).flat();
            }
            return [];
        },
    },
}
</script>

<style scoped>
h2 {
    color: #1B326A;
}
</style>
