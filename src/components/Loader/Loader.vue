<script setup>
</script>

<template>
    <!-- Dialog d'attente de chargement -->
    <div class="loader-div">
        <!-- Présentation -->
        <v-row class="my-4 d-flex align-end justify-center row-welcome">
            <p class="px-3 py-2 loader-text-header">{{ loaderData['welcome'] }}</p>
        </v-row>
        <!-- Présentation -->
        <v-row class="my-4 py-0 d-flex align-center justify-center">
            <div class="d-flex flex-column">
                <p class="px-2 py-0 loader-text-content">{{ loaderData['presentation1'] }}</p>
                <p class="px-2 py-0 loader-text-content">{{ loaderData['presentation2'] }}</p>
            </div>
        </v-row>
        <!-- Enter -->
        <v-row class="my-0 d-flex align-start justify-center row-loading">
            <!-- Loader -->
            <div v-if="!loaded" class="d-flex flex-column align-center justify-center div-loading">
                <p class="px-3 py-1 no-loaded show-loader">{{ percentage }}%</p>
                <div class="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </v-row>
    </div>
</template>

<script>
import { eventBus } from "../../plugins/eventBus";
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default {
    name: 'AppLoader',
    mounted() {
        // GSAP Animation to show/hide header
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(".loader-div", {
            scrollTrigger: {
                trigger: ".loader-div",                             // Where it declenche action
                toggleActions: "restart pause reverse pause",       // "list" of action to do
                start: "top top ",                             // Where trigger start : center of component, center of screen
                end: "bottom top",                                  // Where trigger end : bottom of component, top of screen            
                scrub: 1,                                           // Move every scroll
                pin: true,                                           // Let the component on the middle of the screen
                pinSpacing: false,
                onEnter: () => { },
                onLeave: () => {
                    document.querySelector('.loader-div').style.display = 'none';
                },
                onEnterBack: () => { },
                onLeaveBack: () => {
                    document.querySelector('.loader-div').style.display = '';
                },
            },
            x: () => window.innerWidth,
            duration: 3,
            ease: "none"
        })


        // Disable scrolling
        let scrollTop = document.documentElement.scrollTop;
        let scrollLeft = document.documentElement.scrollLeft;

        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };

    },
    created() {
        // Set when data are loaded
        eventBus.on('dataLoad', (data) => {
            if (data) {
                this.loaded = true
                this.value = this.dataFr['loading2']
            } else {
                this.loaded = false
                this.value = 'Patienter...'
            }
        });
        // Change language
        eventBus.on('languageLoad', (data) => {
            this.dataFr = data[0][0]
            this.dataEng = data[1][0]
            this.loaderData = data[0][0]
        });
        eventBus.on('languageChange', (data) => {
            if (data == 'Fr') {
                this.loaderData = this.dataEng
            } else {
                this.loaderData = this.dataFr
            }
        });
        // Percentage progress
        eventBus.on('progressValue', (data) => {
            this.percentage = parseInt(data)
            if (this.percentage == 100) {
                window.onscroll = function () {
                };
            }
        });
    },
    data() {
        return {
            loaded: false,
            open: true,
            value: 'Patienter... Chargement des photos',
            loaderData: {},
            dataFr: {},
            dataEng: {},
            percentage: 0
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-div {
    overflow: hidden;
    height: 100dvh;
    width: 100vw;
    margin: 0;
    padding: 40px 0px;
    background: linear-gradient(to left, #a1d1f8, var(--background-color-1));
}

/* Welcome part */
.row-loading {
    height: 10vh;
}

/* Text header */
@media screen and (min-width: 320px) {
    .loader-text-header {
        font-size: calc(64px + 6 * ((100vw) / 680));
    }
}
@media screen and (min-width: 1000px) {
    .loader-text-header {
        font-size: 4em;
    }
}
/* Text content */
@media screen and (min-width: 320px) {
    .loader-text-content {
        font-size: calc(32px + 6 * ((100vw) / 680));
    }
}
@media screen and (min-width: 1000px) {
    .loader-text-content {
        font-size: 2em;
    }
}




.no-loaded {
    animation-duration: 1.2s;
}


/* Animation loading */
.div-loading {
    position: absolute;
    width: 120px;
    height: 120px;
    bottom: 200px;
}

.show-loader {
    display: inline-block;
    position: absolute;
    animation-name: clignoter;
    animation-iteration-count: infinite;
    transition: none;
}

.lds-spinner {
    display: inline-block;
    position: absolute;
    width: 120px;
    height: 120px;
}

.lds-spinner div {
    transform-origin: 60px 60px;
    animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 6px;
    left: 55px;
    width: 6px;
    height: 20px;
    border-radius: 20%;
    background: black;
}

.lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
}

.lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
}

.lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
}

.lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
}

.lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
}

.lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
}

.lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
}

.lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
}

.lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
}

.lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
}

.lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
}

.lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
}

@keyframes lds-spinner {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

</style>