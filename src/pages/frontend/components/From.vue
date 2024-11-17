<template>
    <div class="bg-white p-4 rounded">
        <form class="container" @submit.prevent="handleSubmit">
            <div class="pb-5">
                <h4 class="text-dark text-center">Send Us a message</h4>
                <p class="text-dark py-3">Please fill out the form below and we will get back to
                    you as soon as possible.</p>
            </div>
            <div class="py-3">
                <input type="text" :class="{'form-control': true, 'border-danger': errors.name}" id="exampleInputName" v-model="name"
                    aria-describedby="nameHelp" placeholder="Name">
                <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
            </div>
            <div class="py-3">
                <input type="email" :class="{'form-control': true, 'border-danger': errors.email}" id="exampleInputEmail1" v-model="email"
                    aria-describedby="emailHelp" placeholder="Email">
                <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
            </div>
            <div class="py-3">
                <input type="text" :class="{'form-control': true, 'border-danger': errors.subject}" id="exampleInputSubject" v-model="subject"
                    aria-describedby="SubjectHelp" placeholder="Subject">
                <span v-if="errors.subject" class="text-danger">{{ errors.subject }}</span>
            </div>
            <div class="py-3">
                <textarea :class="{'form-control': true, 'border-danger': errors.message}" id="exampleFormControlTextarea1" v-model="message" rows="3"
                    placeholder="Message"></textarea>
                <span v-if="errors.message" class="text-danger">{{ errors.message }}</span>
            </div>
            <button type="submit" class="btn from-btn-color text-light rounded-1 mt-3" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-if="loading"> Sending...</span>
                <span v-else>Send Message</span>
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axiosInstance from '@plugins/axios';

const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');
const errors = ref({});
const loading = ref(false);

const validateForm = () => {
    errors.value = {};
    if (!name.value) errors.value.name = 'Name is required';
    if (!email.value) {
        errors.value.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'Email is invalid';
    }
    if (!subject.value) errors.value.subject = 'Subject is required';
    if (!message.value) errors.value.message = 'Message is required';
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    loading.value = true;
    try {
        const response = await axiosInstance.post('/mailer/send-email', {
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value
        });
        console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending email:', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.from-btn-color {
    background-color: #045DA1;
    color: #fff;
}
.text-danger {
    color: red;
}
.border-danger {
    border-color: red !important;
}
.spinner-border {
    width: 1rem;
    height: 1rem;
    border-width: 0.2em;
}
</style>