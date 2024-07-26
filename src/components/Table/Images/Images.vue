<template>
    <div class="div-image" @click="openProject(projet)">
        <v-img v-if="projet.hasOwnProperty('photos')" :src="returnSrcImage(projet.photos[0].src)" cover class="img-size"></v-img>
        <p v-if="projet.hasOwnProperty('name')" class="title-image">{{ projet.name }}</p>
    </div>
</template>

<script>
import { eventBus } from '../../../plugins/eventBus'

export default {
    name: 'AppImages',
    components: {
    },
    created() {
    },
    mounted() { // Lance la fonction au chargement de la page
    },
    props: {
        projet: {
            name: String,
            date: String,
            intro: String,
            description: String,
        },
        id: Number
    },
    data() {
        return {
        }
    },
    methods: {
        // Get image src if def or prod
        returnSrcImage(src) {
            if (import.meta.env.DEV) {
                return new URL('../../../../../images/' + src, import.meta.url).href
            } else {
                return 'images/' + src
            }
        },
        // Open poup
        openProject(projet) {
            eventBus.emit('openThisProject', projet)
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');

/* Div component */
.div-image {
    position: relative;
    width: auto;
    height: 75vh;
    filter: grayscale(100%);
    transition: transform 0.3s ease-in-out; 

    p {
        display: none;
    }
}

.div-image:hover {
    cursor: pointer;
    transform: scale(1.02);
    z-index: 1000;
    filter: grayscale(0%);
    border-radius: 5px;

    p {
        display: block;
        position: fixed;
        bottom: 20px;
        margin-left: 10px;
        /* font-family: 'Staatliches', cursive; */
        font-size: 2.5vw;
        text-decoration: underline;
        flex-shrink: 0;
        color: var(--background-color-1);
        /* Couleur du texte en blanc */
        text-shadow: -2px -2px 0 var(--font-color), 2px -2px 0 var(--font-color), -2px 2px 0 var(--font-color), 2px 2px 0 var(--font-color);
        /* Ombre de texte pour le contour noir */

    }

}

/* Image size */
.img-size {
    height: 100%;
    width: 30vw;
}

@media (max-width: 1199px) {
    .div-image {
        position: relative;
        width: 100%;
        height: 20vh;
        filter: grayscale(0%);
    }

    .img-size {
        width: 100% !important;
        height: 100% !important;
    }
}
</style>