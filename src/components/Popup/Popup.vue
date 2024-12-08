<template>
    <div class="popup-div">
        <div class="popup-div__header">
            <p class="popup-div__title" v-if="project">{{ project.name }}</p>
            <button @click="$emit('close')">Fermer</button>
        </div>

        <div class="modal-content">
            <p v-if="project" v-html="project.description"></p>
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
    background-color: var(--popup-background-color);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup-div__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.popup-div__title {
    font-size: xxx-large;
    text-align: left;
}

.modal-content {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    margin-top: 10px;
    
    p {
        height: 120%;
    }
}


.modal-content::-webkit-scrollbar {
    /* Fond de la barre de scroll */
    width: 12px;
    padding: 5px;
    margin: 5px;
    background-color: var(--popup-background-color);
    border-radius: 10px;
}

.modal-content::-webkit-scrollbar-button {
    /* Boutons haut/bas */
    display: none;
}

.modal-content::-webkit-scrollbar-thumb {
    /* Bouton de la barre de scroll */
    background-color: var(--first-color);
    border-radius: 10px;
}
</style>