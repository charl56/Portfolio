<template>
    <div class="popup-div">
        <div class="popup-div__header">
            <p class="popup-div__title" v-if="project">{{ project.name }}</p>
            <button @click="$emit('close')">Fermer</button>
        </div>
        <div v-if="project" class="modal-content">
            <div v-if="project" class="popup-photos">
                <Photos3d :projectName="renameProjectForId(project.name)" :photos="project.photos" />
            </div>
            <!-- Intro -->
            <p class="" v-html="project.intro"></p>
            <!-- Description -->
            <p class="" v-html="project.description"></p>
            <!-- Liste des outils utilisés -->
            <p class="" v-html="project.outil"></p>
            <ul class="">
                <li v-for="outil, index in project.outils" :key="index">{{ outil.name }}</li>
            </ul>
            <!-- Dates -->
            <p class="">{{ project.date }}</p>
        </div>
    </div>
</template>

<script>
import Photos3d from './Photos3d/Photos3d.vue';

export default {
    name: 'Popup',
    components: {
        Photos3d
    },
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
        },
        renameProjectForId(projectName) {
            return projectName.replace(/ /g, '-').toLowerCase()
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
    /* margin: 5px; */

    z-index: 5;
    background-color: var(--popup-background-color);
    background-color: #525252;
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
        height: 50%;
    }
}

.popup-photos {
    height: 100%;
    width: 50%;
}


@media (max-width: 1000px) {
    .popup-photos {
        width: 100% !important;
        height: 50% !important;
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