<template>
    <section class="bg-light py-5">
        <div class="container py-5 serviceCard">
            <div class="row d-flex justify-content-center">
                <div 
                    v-for="(card, index) in cards" 
                    :key="index" 
                    class="col-12 col-md-3 col-lg-3 py-3 d-flex justify-content-center"
                >
                    <div class="card border-0 rounded-3 shadow-sm" style="width: 18rem;">
                        <div class="card-body text-center">
                            <img :src="card.imgSrc" height="110px" :alt="card.altText">
                            <h5 class="card-title fw-bold">{{ card.title }}</h5>
                            <p class="card-text">{{ card.text }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const cards = [
    {
        imgSrc: 'src/assets/mks-logo-(3).png',
        altText: 'Quality Driven',
        title: 'Quality Driven',
        text: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    },
    {
        imgSrc: 'src/assets/mks-logo(5).png',
        altText: 'Customer Focused',
        title: 'Customer Focused',
        text: 'Satisfying customers for more than 14 years with top-quality workmanship!'
    },
    {
        imgSrc: 'src/assets/mks-logo(6).png',
        altText: 'Global Recognition',
        title: 'Global Recognition',
        text: 'We are globally Recognized as being a service-driven, friendly, result oriented'
    }
];
</script>

<style scoped>
.serviceCard {
    background-color: #f8f9fa;
}
</style>