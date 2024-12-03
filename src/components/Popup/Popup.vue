<template>
    <div class="popup-div">
        <div class="modal-content">
            <h2 v-if="project">{{ project.name }}</h2>
            <p v-if="project" v-html="project.description"></p>
            <button @click="$emit('close')">Fermer</button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Popup',
    props: ['project'],
    mounted() {
        document.body.style.overflow = 'hidden';
    },
    beforeUnmount() {
        document.body.style.overflow = 'auto';
    },
    methods: {
        getImageUrl(src) {
            return import.meta.env.DEV
                ? new URL(`../../images/${src}`, import.meta.url).href
                : `images/${src}`;
        }
    }
}
</script>


<style scoped>
.popup-div {
    height: 100dvh;
    width: 100vw;
    top: 0;
    left: -100vw;
    position: fixed;
    
    z-index: 5;
    background-color: var(--second-color);

    display: flex;
    justify-content: center;
    align-items: center;
}


</style>