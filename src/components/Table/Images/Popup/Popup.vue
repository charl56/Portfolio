<template>
    <Transition @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" :css="false">
        <div v-if="open" class="div-popup-transistion d-flex align-center justify-center">
            <div class="projet px-0 mx-0 my-0 justify-space-between">
                <!-- Back btn -->
                <div class="div-arrow-down d-flex align-start justify-center my-3">
                    <div id="lottie-arrow-down" @click="open = !open"></div>
                </div>
                <!-- Images -->
                <div id="resizable" class="part">
                    <v-carousel v-if="project.hasOwnProperty('photos1')" cycle class="d-flex justify-center" :show-arrows="setShowArrows(project.photos1)" hide-delimiters>
                        <v-carousel-item id="image-projet" v-for="(photo, index) in project.photos1" :src="returnSrcImage(photo.src)" :key="index" width="100vw" height="auto">
                            <p v-if="photo.hasOwnProperty('desc')" class="p-desc-photo px-2">{{ photo.desc }}</p>
                        </v-carousel-item>
                    </v-carousel>
                </div>
                <!-- Text -->
                <div class="center px-3 my-4 d-flex flex-column">
                    <!-- TItre -->
                    <p :class="textSize()" class="mb-3 mt-0 text-justify align-self-center text-decoration-underline">{{ project.name }}</p>
                    <!-- Intro -->
                    <p v-if="project.hasOwnProperty('intro')" :class="textSize()" class="mb-2 mt-3 text-justify align-self-center" v-html="project.intro"></p>
                    <!-- Description -->
                    <p :class="textSize()" class="mb-2 mt-3 text-justify" v-html="project.description"></p>
                    <!-- Liste des outils utilisés -->
                    <p v-if="project.hasOwnProperty('outils')" :class="textSize()" class="text-start mt-2 mb-0">{{ project.outil }}</p>
                    <ul v-for="outil, index in project.outils" :key="index" class="d-flex justify-start pl-5">
                        <li :class="outilSize()">{{ outil.name }}</li>
                    </ul>
                    <!-- Dates -->
                    <p v-if="project.hasOwnProperty('date')" :class="dateSize()" class="mt-10 mb-0 text-center font-italic align-self-end">{{ project.date }}</p>
                </div>
                <!-- Images -->
                <div class="part">
                    <v-carousel v-if="project.hasOwnProperty('photos2')" cycle class="d-flex justify-center" :show-arrows="setShowArrows(project.photos2)" hide-delimiters>
                        <v-carousel-item id="image-projet" v-for="(photo, index) in project.photos2" :src="returnSrcImage(photo.src)" :key="index" width="100vw" height="auto">
                            <p v-if="photo.hasOwnProperty('desc')" class="p-desc-photo px-2">{{ photo.desc }}</p>
                        </v-carousel-item>
                    </v-carousel>
                    <div v-else-if="project.hasOwnProperty('video')" class="div-video">
                        <v-carousel class="d-flex justify-center" show-arrows="hover" hide-delimiters width="100%" height="400px">
                            <v-carousel-item v-for="(video, index) in project.video" :key="index">
                                <video id="video-projet" controls>
                                    <source :src="returnSrcImage(video.src)">
                                </video>
                            </v-carousel-item>
                        </v-carousel>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>


<script>
// Events
import { eventBus } from '../../../../plugins/eventBus';
import gsap from 'gsap'
import '../../../../plugins/body-movin'
// Functions
import {popup} from '../../../../plugins/popup-functions'

export default {
    name: 'AppPopup',
    components: {
    },
    created() { // Lance la fonction au chargement de la page
        eventBus.on('openThisProject', (data) => {
            this.open = true
            this.project = data
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
            this.setLottieAnimation()
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
        setLottieAnimation(){
            // Lottie animation arrow
            bodymovin.loadAnimation({
                container: document.getElementById('lottie-arrow-down'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: new URL('../../../../assets/Json/scroll-down.json', import.meta.url).href
            })
        },
        returnSrcImage(src){
            if(import.meta.env.DEV){
                return new URL('../../../../../images/' + src, import.meta.url).href   
            } else {
                return 'images/' + src   
            }
        },
        setShowArrows(data){
            return popup.setShowArrows(data)
        },
        outilSize(){
            return popup.outilSize()
        },
        textSize() {         // Text size responsive
            return popup.textSize()
        },
        dateSize(){
            return popup.dateSize()
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Size popup */
.div-popup-transistion {
    z-index: 1006;
    position: fixed;
    top: 0%;
    left: 0%;
    height: 100%;
    width: 100%;
    background-color: var(--background-color-1);
}
/* Lotti btn back */
.div-arrow-down{
    height: 10vh;
    width: 100%;
}#lottie-arrow-down{
    height: 80%;
    width: fit-content;
}#lottie-arrow-down:hover{
    cursor: pointer;
    transform: scale(1.1);
}

/* Projet design */
.projet{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
}
.part, .center{
    height: auto;
    width: 100%;
}

/* Desc photos */
.p-desc-photo{
    position: relative;
    top: 90%;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    border-radius: 5px;
    background-color: var(--background-color-1);
    font-size: 2vw;
    color: var(--font-color);
}


/* Videos */
.div-video{
    height: auto !important;
    width: 100% !important;
}
#video-projet{
    width: auto;
    height: 100%;
}
</style>