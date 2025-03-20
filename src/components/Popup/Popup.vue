<template>
    <!-- Inspiration => image animation scroll : https://codepen.io/GreenSock/pen/QWjjYEw -->
    <div class="popup-div" v-observe-visibility="handleVisibility">
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
                    <p v-if="info" v-html="info.value"></p>
                </div>
                <div class="modal-content__image" :style="{ backgroundImage: `url(${getImageUrlWithIndex(index)})` }">
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
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nextTick } from "vue";
import getAssetSrc from '@/utils/imageUtils';

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
                    this.imagesWithIndex = this.project.photos.map(photo => getAssetSrc(photo.src));
                }

                this.initImagesAnimation();
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
        gsap.registerPlugin(ScrollTrigger);
    },
    beforeUnmount() {
        document.body.style.overflow = 'auto';
    },
    directives: {
        observeVisibility: {
            mounted(el, binding) {
                const observer = new IntersectionObserver((entries) => {
                    const isVisible = entries[0].isIntersecting;
                    if (binding.value) binding.value(isVisible);
                }, {
                    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
                });
                observer.observe(el);
            },
            unmounted(el) {
                // Nettoyer l'observer
                if (el._observer) {
                    el._observer.disconnect();
                }
            }
        }
    },
    methods: {
        initImagesAnimation() {
            ////// Scroll animation

            // Get the scrollable container
            const scroller = document.querySelector('.popup-div__content');

            // Configure default ScrollTrigger settings for this scroller
            ScrollTrigger.defaults({
                scroller: scroller
            });


            const images = document.querySelectorAll('.modal-content__image');


            images.forEach((img, i) => {
                console.log();

                gsap.fromTo(img, {
                    backgroundPosition: () => `${i % 2 === 0 ? '20%' : '80%'} center`
                }, {
                    backgroundPosition: () => `${i % 2 === 0 ? '80%' : '20%'} center`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img,
                        start: `top bottom`,     // Trigger at the top of component, and bottom of screen
                        end: `bottom top`,          // Trigger at the bottom of component, and top of screen
                        scrub: true,
                    }
                });
            })

            // Refresh ScrollTrigger to ensure proper positioning
            ScrollTrigger.refresh();


            if (window.innerWidth < 768) {
                return
            }
            ////// Hover animation 
            const textInfos = document.querySelectorAll('.text-infos');

            textInfos.forEach((element, index) => {
                const direction = index % 2 === 0 ? 'right' : 'left';

                element.addEventListener('mouseenter', () => {
                    gsap.to(element, {
                        [direction]: 'auto',
                        duration: 0.6,
                        ease: 'power2.inOut'
                    });
                });


                element.addEventListener('mouseleave', () => {
                    gsap.to(element, {
                        [direction]: '20vw',
                        duration: 0.6,
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


<style>
.popup-div {
    height: 100vh;
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

    a {
        text-decoration: underline;
        text-decoration-style: dotted;
    }

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
    height: 100%;
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


}

/* modal */
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
    height: 30vh;
    width: 40vw;


    background-size: 115%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 20px;

}


@media (max-width: 768px) {
    .modal-content__image {
        height: 19vh;
        width: 150vw;
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
    }
}



/* text */
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
            max-height: 15vh;
            width: 50vw;
            padding: 0px 5px;
        }
    }

    .text-infos:nth-child(even) {
        flex-direction: row;

        .modal-content__infos {
            align-items: flex-start;

            p {
                text-align: start;
            }
        }
    }

    .text-title,
    .text-date {
        p {
            font-size: 2.2em;
        }
    }
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