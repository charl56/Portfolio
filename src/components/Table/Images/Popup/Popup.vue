<template>
    <Transition @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
        <div v-if="open" class="popup-div">
            <div class="popup-description">
                <div class="popup-closer" @click="closePopup">
                    fermer
                </div>
                <!-- Titre -->
                <p class="">{{ project.name }}</p>
                <!-- Intro -->
                <p v-if="project.hasOwnProperty('intro')" class="" v-html="project.intro"></p>
                <!-- Description -->
                <p class="" v-html="project.description"></p>
                <!-- Liste des outils utilisés -->
                <ul class="">
                    <p v-if="project.hasOwnProperty('outils')" class="">{{ project.outil }}</p>
                    <li v-for="outil, index in project.outils" :key="index">{{ outil.name }}</li>
                </ul>
                <!-- Dates -->
                <p v-if="project.hasOwnProperty('date')" class="">{{ project.date }}</p>
            </div>
            <div class="popup-photos">
                <Photos3d :projectName="renameProjectForId(project.name)" :photos="project.photos" />
            </div>

        </div>
    </Transition>
</template>


<script>
// Events
import { eventBus } from '../../../../plugins/eventBus';
import gsap from 'gsap'
import '../../../../plugins/body-movin'
import Photos3d from './Photos3d/Photos3d.vue';

export default {
    name: 'AppPopup',
    components: {
        Photos3d
    },
    created() {
        // Lance la fonction au chargement de la page
        eventBus.on('openThisProject', (data) => {
            this.openPopup(data)
        });
        // Is use to open popup on the mouse
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = -((window.innerWidth / 2) - e.x)
            this.mouse.y = -((window.innerHeight / 2) - e.y)
        }, false)

    },
    data() {
        return {
            open: false,        // Booleen open popup
            project: {},        // Data from project
            mouse: {            // Mouse pos
                x: 0,
                y: 0,
            }
        }
    },
    methods: {
        openPopup(data) {
            this.project = data
            this.open = true

            let scrollTop = document.documentElement.scrollTop;
            let scrollLeft = document.documentElement.scrollLeft;

            window.onscroll = function () {
                window.scrollTo(scrollLeft, scrollTop);
            };
        },
        closePopup() {
            this.open = false
            window.onscroll = function () {
            };
        },
        // Transition opening
        onBeforeEnter(el) {
            gsap.set(el, {
                scaleX: 0.1,
                scaleY: 0.1,
                opacity: 0.5,
                x: this.mouse.x,
                y: this.mouse.y,
            })
        },
        onEnter(el, done) {
            gsap.to(el, {
                duration: 1,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                ease: 'elastic.inOut(1.5, 0.8)',
                onComplete: done,
                x: 0,
                y: 0
            })
            // this.setLottieAnimation()
        },
        onLeave(el, done) {
            gsap.to(el, {
                duration: 0.7,
                scaleX: 1,
                scaleY: 1,
                y: 500,
                ease: 'elastic.inOut(2.5, 1)'
            })
            gsap.to(el, {
                duration: 0.2,
                delay: 0.5,
                opacity: 0,
                onComplete: done
            })
        },
        returnSrcImage(src) {
            if (import.meta.env.DEV) {
                return new URL('../../../../../images/' + src, import.meta.url).href
            } else {
                return 'images/' + src
            }
        },
        renameProjectForId(projectName) {
            return projectName.replace(/ /g, '-').toLowerCase()
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-div {
    height: 80vh;
    width: 100vw;
    top: 10vh;
    position: fixed;
    background-color: var(--background-color-1);
    display: flex;
    flex-direction: row;
    z-index: 1013;
}

.popup-description,
.popup-photos {
    height: 100%;
    width: 50%;
}

/*  */
.popup-description {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1014;
    overflow: scroll;
}

.popup-description p {
    font-size: larger;
    margin: 10px 20px;
}

.popup-description ul p {
    margin: 0px;
}

.popup-description p:first-of-type {
    font-size: xx-large;
}

.popup-description p:last-of-type {
    font-size: medium;
    font-style: italic;
}

/*  */
.popup-photos:hover {
    z-index: 1013;
    cursor: pointer;
}

/* Btn close */
.popup-closer {
    top: 0;
    right: 0;
    position: absolute;
    width: min-content !important;
    height: min-content !important;
    z-index: 1015;
    font-size: large;
    padding: 5px 10px;
    border-bottom-left-radius: 5px;
}

.popup-closer:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
}

/* Media query for smaller screens */
@media (max-width: 550px) {
    .popup-div {
        height: 100dvh;
        top: 0vh;
        flex-direction: column !important;
    }

    .popup-description,
    .popup-photos {
        width: 100% !important;
        height: 50% !important;
    }


    .popup-closer {
        top: 10px;
        right: 10px;
    }
}
</style>