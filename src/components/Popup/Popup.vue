<template>
    <div class="popup-div">
        <div class="popup-div__header">
            <p class="popup-div__title" v-if="project">{{ project.name }}</p>
            <div class="popup-div__button">
                <button @click="$emit('close')">Fermer</button>
            </div>
        </div>
        <div v-if="project" class="modal-content">
            <div class="modal-content__text">
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
            <div class="modal-content__galery">
                <img v-for="image in project.photos" class="modal-content__image" :src="getImageUrl(image.src)"
                    alt="image" />
            </div>

        </div>
    </div>
</template>

<script>
// import Photos3d from './Photos3d/Photos3d.vue';
// <div v-if="project" class="popup-photos">
//    <Photos3d :projectName="renameProjectForId(project.name)" :photos="project.photos" />
// </div> 

export default {
    name: 'Popup',
    components: {
        // Photos3d
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
                ? new URL(`../../../images/${src}`, import.meta.url).href
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

    z-index: 5;
    background-color: var(--popup-first-color);


    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup-div__header {
    width: 100%;
    display: flex;

    position: relative;
}

.popup-div__title {
    width: 80%;
    font-size: xxx-large;
    text-align: left;
    margin-left: 10px;
}

.popup-div__button {
    width: 20%;
    display: flex;
    justify-content: flex-end;
}

.modal-content {
    height: auto;
    width: 100%;
    overflow-y: auto;
    margin-top: 10px;

    display: flex;
    flex-direction: row;

    p {
        height: auto;
        padding: 20px 20px 200px;
    }
}


.modal-content__text {
    height: auto;
    width: 40%;
    display: flex;
    flex-direction: column;
}

.modal-content__galery {
    height: 100%;
    width: 60%;
    display: flex;
    flex-direction: column;
}

@media (max-width: 768px) {
    .modal-content {
        flex-direction: column;
    }

    .modal-content__text {
        height: 40%;
        width: 100%;
    }

    .modal-content__galery {
        height: 60%;
        width: 100%;
    }
}

.modal-content__image {
    height: 100px;
    width: fit-content;
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
    background-color: var(--popup-second-color);
    border-radius: 10px;
}

.modal-content::-webkit-scrollbar-button {
    /* Boutons haut/bas */
    display: none;
}

.modal-content::-webkit-scrollbar-thumb {
    /* Bouton de la barre de scroll */
    background-color: var(--popup-first-color);
    border-radius: 10px;
}
</style>