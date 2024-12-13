<template>
    <!-- Inspiration => colors : https://victor.work/ -->

    <div class="popup-div">
        <div class="popup-div__header">
            <div class="popup-div__button">
                <svg @click="closePopup()" class="cursor-hover" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    width="48" height="48" viewBox="0,0,256,256">
                    <g fill-opacity="0" fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1"
                        stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
                        stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"
                        style="mix-blend-mode: normal">
                        <path d="M0,256v-256h256v256z" id="bgRectangle"></path>
                    </g>
                    <g fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt"
                        stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                        font-family="none" font-weight="none" font-size="none" text-anchor="none"
                        style="mix-blend-mode: normal">
                        <g transform="scale(4,4)">
                            <path
                                d="M16,14c-0.512,0 -1.02306,0.19494 -1.41406,0.58594c-0.781,0.781 -0.781,2.04712 0,2.82812l14.58594,14.58594l-14.58594,14.58594c-0.781,0.781 -0.781,2.04713 0,2.82812c0.391,0.391 0.90206,0.58594 1.41406,0.58594c0.512,0 1.02306,-0.19494 1.41406,-0.58594l14.58594,-14.58594l14.58594,14.58594c0.781,0.781 2.04713,0.781 2.82812,0c0.781,-0.781 0.781,-2.04713 0,-2.82812l-14.58594,-14.58594l14.58594,-14.58594c0.781,-0.781 0.781,-2.04712 0,-2.82812c-0.781,-0.781 -2.04713,-0.781 -2.82812,0l-14.58594,14.58594l-14.58594,-14.58594c-0.391,-0.391 -0.90206,-0.58594 -1.41406,-0.58594z">
                            </path>
                        </g>
                    </g>
                </svg>
            </div>
        </div>


        <div class="popup-div__content">

            <div v-if="project" class="modal-content text-title">
                <p v-html="project.name"></p>
            </div>

            <div v-if="project" v-for="(info, index) in project.infos" class="modal-content text-infos">
                <div class="modal-content__infos">
                    <div class="modal-content__animation">
                        <p v-if="info" v-html="info.value"></p>
                    </div>
                </div>
                <div class="modal-content__image">
                    <img class="cursor-hover" :src="getImageUrlWithIndex(index)" alt="">
                </div>
            </div>
            <div v-if="project" class="modal-content text-outil">
                <p v-html="project.outil"></p>
                <ul>
                    <li v-for="outil, index in project.outils" :key="index">{{ outil.name }}</li>
                </ul>
            </div>
            <div v-if="project" class="modal-content text-date">
                <p v-html="project.date"></p>
            </div>

        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { nextTick } from "vue";

export default {
    name: 'Popup',
    props: {
        project: {
            type: Object,
            required: false,
        },
    },
    watch: {
        project() {
            // Wait DOM update
            nextTick(() => {

                this.imagesWithIndex = null;

                if (this.project != null) {
                    this.imagesWithIndex = this.project.photos.map(photo => this.getImageUrl(photo.src));
                }

                if (window.innerWidth > 768) {
                    this.initImagesAnimation();
                }
            });
        }
    },
    data() {
        return {
            progress: 0,
            imagesWithIndex: null,
        }
    },
    mounted() {
        document.body.style.overflow = 'hidden';



    },
    beforeUnmount() {
        document.body.style.overflow = 'auto';
    },
    methods: {
        initImagesAnimation() {
            const textInfos = document.querySelectorAll('.text-infos');

            textInfos.forEach((element, index) => {
                const direction = index % 2 === 0 ? 'right' : 'left';

                element.addEventListener('mouseenter', () => {
                    gsap.to(element, {
                        [direction]: 'auto',
                        duration: 0.5,
                        ease: 'power2.inOut'
                    });
                });


                element.addEventListener('mouseleave', () => {
                    gsap.to(element, {
                        [direction]: '20vw',
                        duration: 0.5,
                        ease: 'power2.inOut'
                    });
                });
            });

            // Change color. It don't take css class because elements aren't set when window is loaded
            textInfos.forEach(textInfo => {
                const links = textInfo.querySelectorAll('a');
                links.forEach(link => {
                    link.style.color = 'black';
                });
            });


        },
        getImageUrl(src) {
            return import.meta.env.DEV
                ? new URL(`../../../images/${src}`, import.meta.url).href
                : `images/${src}`;
        },
        getImageUrlWithIndex(index) {
            if (this.imagesWithIndex && this.imagesWithIndex.length > 0) {
                return this.imagesWithIndex[index % this.imagesWithIndex.length]
            }

            return null;
        },
        renameProjectForId(projectName) {
            return projectName.replace(/ /g, '-').toLowerCase()
        },
        closePopup() {
            this.$emit('close');
        }
    }
}
</script>


<style scoped>
.popup-div {
    height: 100vh;
    width: 100vw;
    top: 0;
    left: -100vw;
    position: fixed;

    z-index: 5;
    background-color: var(--popup-first-color);
    /* background: linear-gradient(232deg, #9d9dad 0, #d1d1d2);; */

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup-div__header {
    width: 100%;
    display: flex;
    top: 0;
    height: auto;
    z-index: 1;

    position: absolute;

    .popup-div__button {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 0px 10px;

        svg {
            transition: transform 0.2s ease-in;
        }

        svg:hover {
            transform: scale(1.15);
        }
    }
}


.popup-div__content {
    position: absolute;
    height: 100vh;
    width: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    perspective: 1500px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* ************************************* */



/* ************************************* */
.modal-content {
    p {
        color: #001446;
        text-align: justify;
        padding: 2px 5px;
    }
}

.modal-content__infos {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    p {
        text-align: end;
    }

}




.modal-content__image {
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: flex-end;
}




.text-title {

    p {
        font-size: 4em;
    }
}

.text-infos {
    display: flex;
    flex-direction: row-reverse;
    height: 100%;
    align-items: flex-end;

    position: relative;
    left: 20vw;
    right: auto;

    margin-bottom: 20px;

    p {
        font-size: 3em;
        text-align: end;
    }

    img {
        height: auto;
        width: 40vw;
        transition: transform 0.1s ease-in;
        border-radius: 20px;
    }
}

@media (min-width: 768px) {

    .text-infos:nth-child(even) {
        flex-direction: row;
        left: auto;
        right: 20vw;


        .modal-content__infos {
            align-items: flex-start;

            p {
                text-align: start;
            }
        }

        .modal-content__image {
            justify-content: flex-start;
        }
    }
}


.text-outil {
    p {
        font-size: 2em;
    }
}

.text-date {
    p {
        font-size: 3em;
        text-align: right;
    }
}

/* ******************************* */

@media (max-width: 768px) {
    .popup-div__content {
        flex-direction: column;
    }

    .text-infos {
        display: flex;

        height: 40vh;
        left: auto;
        right: auto;

        p {
            font-size: 1.4em;
        }

        img {
            width: 50vw;
            padding: 0px 5px;
        }
    }

    .text-infos:nth-child(even){
        flex-direction: row;
    }
    
    .text-title,
    .text-date {
        p {
            font-size: 2.2em;
        }
    }
}



.item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 60px;
    margin: 10px;
    transform-style: preserve-3d;
    background: #b0b0b0;
    box-shadow: rgb(255 255 255) 15px -10px 25px -5px;
}


.popup-div__content::-webkit-scrollbar {
    /* Fond de la barre de scroll */
    width: 10px;
    background-color: var(--popup-first-color);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.popup-div__content::-webkit-scrollbar-button {
    /* Boutons haut/bas */
    display: none;
}

.popup-div__content::-webkit-scrollbar-thumb {
    /* Bouton de la barre de scroll */
    background-color: var(--popup-second-color);
    border-radius: 10px;
}
</style>