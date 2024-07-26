<template>
    <div v-if="!showPhotos" class="photos3d-loader">
        <p class="photos3d-description">Utiliser le clique gauche pour pivoter, clique droit pour déplacer l'objet et la
            molette pour zommer/dezoomer</p>
        <p class="photos3d-loader-text">Chargement des photos {{ loadingProgress }}%</p>
        <button class="photos3d-loader-btn" @click="this.showPhotos = true">Voir les photos</button>
    </div>
    <div :id="projectName" class="photos3d-scene d-flex justify-center align-center">
    </div>
</template>

<script>
import { PhotoVisualisation } from './script.js';
import { gsap } from "gsap";

export default {
    props: {
        projectName: {
            type: String,
            required: true,
        },
        photos: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            loadingProgress: 0,
            showButton: false,
            showPhotos: false,
        };
    },
    watch: {
        projectName: 'initPhotos3d',
    },
    mounted() {
        if(window.screen.width < 550) {
            document.querySelector(".photos3d-description").innerText = "Utiliser 1 doigt pour pivoter, et 2 pour déplacer l'objet ou zommer/dezoomer";
        }
        this.container = document.getElementById(this.projectName);

        gsap.to('.photos3d-loader-text', {
            duration: 2,
            x: 750,
            ease: "expo.inOut",
        }).then(() => {
            this.initPhotos3d();
        });
    },
    methods: {
        initPhotos3d() {
            this.container.innerHTML = '';
            new PhotoVisualisation(this.projectName, this.container, this.photos, (progress) => {
                this.loadingProgress = progress;
                if (progress === 100) {
                    gsap.to('.photos3d-loader-text', {
                        duration: 0.5,
                        x: 1500,
                        ease: "expo.inOut",
                    }).then(() => {
                        gsap.to('.photos3d-loader-btn', {
                            duration: 0.5,
                            x: -750,
                            ease: "expo.inOut",
                        })
                    });
                }
            });
        }
    },

};
</script>

<style scoped>
.photos3d-loader {
    height: 100%;
    width: 50%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px 30px;
}

@media (max-width: 550px) {
    .photos3d-loader {
        width: 100%;
        height: 50%;
        padding: 10px 30px;
    }
}

.photos3d-scene {
    height: 100%;
    width: 100% !important;
}

.photos3d-loader-text {
    left: -750px;
    position: relative;
    font-size: larger;
}

.photos3d-description {
    font-size: larger;
}
@media (max-width: 550px) {
    .photos3d-description, .photos3d-loader-text {
        font-size: xx-large;
    }
}   

.photos3d-loader-btn {
    left: 750px;
    position: relative;
    font-size: larger;
    border: 0.5px solid white;
    padding: 5px 10px;
    border-radius: 5px;
}
@media (max-width: 550px) {
    .photos3d-loader-btn {
        font-size: xx-large;
    }
}

.photos3d-loader-btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
</style>