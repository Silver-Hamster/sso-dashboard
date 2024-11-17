<template>
    <section class="getin-touch   py-5">
        <div class="container">
            <div class="row py-5">
                <div class="col-12 col-md-6 col-lg-7 text-light">
                    <div class=" text-start py-5">
                        <div class="row py-2">

                            <div class="col-4 col-md-3 col-lg-3">
                                <h4 class="">Get In Touch</h4>

                            </div>
                            <div class="col-8 col-md-7 col-lg-8  align-self-center">
                                <hr class="white-line">

                            </div>

                        </div>
                        <div>
                            <ul class="list-unstyled">
                                <li class="d-flex align-items-center py-2"><i class="fas fa-map-marker-alt me-3"></i>
                                    <span>
                                        Manana Road Samalkha, Panipat, Haryana,
                                        India, 132103</span>
                                </li>
                                <li class="d-flex align-items-center py-2"><i class="fas fa-phone-alt me-3"></i> <span>
                                        +91 93501-40037</span></li>
                                <li class="d-flex align-items-center py-2"><i class="fas fa-envelope me-3"></i>
                                    <span> Sales@mksindustrialsolutions.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class=" text-start py-5">
                        <div class="row py-2">

                            <div class="col-3 col-md-3 col-lg-3">
                                <h4 class="">Find Us</h4>

                            </div>
                            <div class="col-9 col-md-7 col-lg-8 align-self-center">
                                <hr class="white-line">

                            </div>

                        </div>
                        <div class="map-container px-2 embed-responsive embed-responsive-16by9">
                            <iframe class="embed-responsive map"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d66064.20320075586!2d76.994778!3d29.256479000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dc5ae6031269d%3A0xc93a6399f41e1b3e!2sMKS%20INDUSTRIAL%20SOLUTIONS!5e1!3m2!1sen!2sin!4v1730015803147!5m2!1sen!2sin"
                                 style="border:0;" allowfullscreen="" loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                    <div class=" text-start py-5">
                        <div class="row py-2">

                            <div class="col-3 col-md-3 col-lg-3">
                                <h4 class="">Follow Us</h4>

                            </div>
                            <div class="col-9 col-md-7 col-lg-7 align-self-center">
                                <hr class="white-line">

                            </div>

                        </div>
                        <div>
                            <div class="social-media-icons">
                                <a href="https://www.facebook.com" class="px-3 my-2 rounded" target="_blank"
                                    rel="noopener noreferrer">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="https://www.twitter.com" class="px-3 my-2  rounded" target="_blank"
                                    rel="noopener noreferrer">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="https://www.instagram.com" class="px-3 my-2  rounded" target="_blank"
                                    rel="noopener noreferrer">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="https://www.linkedin.com" class="px-3 my-2  rounded" target="_blank"
                                    rel="noopener noreferrer">
                                    <i class="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>


                </div>
                <!-- from -->
                <div class="col-12 col-md-6 col-lg-4 offset-lg-1 text-light align-self-center">
                    <From />
                </div>

            </div>
        </div>
    </section>
</template>
<script setup>
import From from './From.vue';
</script>
<style scoped>
.getin-touch {
    background-color: #1B326A;
   
}

h2 {
    color: #ffff;
}

.from-btn-color {
    background-color: #045DA1;
    color: #fff;
}
.map {
    width: 460px ;
    height: 200px ;
}
@media (max-width: 600px) {
    .map {
        width: 460px;
        height: 150px;
    }
}
@media (min-width: 768px) and (max-width: 1024px) {
    .map {
        width: 300px;
        height: 200px;
    }
}
@media (min-width: 1024px) {
    .map {
        width: 600px !important;
        height: 200px !important;
    }
}

.map-container {
    filter: grayscale(100%);
}

.white-line {
    border: 2px solid white;
    border-top: 2px solid white;
    margin-top: 10px;
    /* Adjust as needed */
}

.social-media-icons {
    display: flex;
    gap: 10px;
}

.social-media-icons a {
    border: 1px solid #dedddd;
    background-color: #dedddd;
    color: #000;
    font-size: 24px;
    text-decoration: none;
}

.social-media-icons a:hover {
    color: #0073e6;
}
</style>