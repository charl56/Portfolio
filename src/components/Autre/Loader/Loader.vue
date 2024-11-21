<script setup>
</script>

<template>
    <!-- Dialog d'attente de chargement -->
    <div class="loader-div">
        <!-- Loader -->
        <div class="loading-percentage-parent">
            <div class="loading-percentage-child">
                <p class="loading-percentage-text">Chargement... {{ percentage }}%</p>
            </div>
        </div>
        <!-- Présentation -->
        <v-row class="my-4 d-flex align-end justify-center row-welcome">
            <p class="px-3 py-2 loader-text-header" id="loader-text-header">Bienvenue</p>
        </v-row>
        <!-- Présentation -->
        <v-row class="my-4 py-0 d-flex align-center justify-center">
            <div class="d-flex flex-column">
                <p class="px-2 py-0 loader-text-content" id="loader-text-content">{{ loaderData['presentation1'] }}</p>
            </div>
        </v-row>
    </div>
</template>

<script>
import { eventBus } from "../../plugins/eventBus";
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//
import SplitType from 'split-type';


export default {
    name: 'AppLoader',
    mounted() {

        if (window.screen.width > 1000) {
            gsap.from('.loading-percentage-text', {
                duration: 1,
                y: -150,
                stagger: 0.5,
                delay: 0.4,
                ease: "expo.inOut",
            })


            // GSAP Animation to show/hide loader
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


        }

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
                document.get
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
                // When data load : hide loader text
                gsap.to('.loading-percentage-text', {
                    duration: 1,
                    y: 150,
                    ease: "expo.inOut",
                }).then(() => {
                    // Then slide to show welcome text
                    gsap.to('.loading-percentage-parent', {
                        duration: 1,
                        y: -window.innerHeight,
                        ease: "power1.inOut",
                    })
                })
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

@media (max-width: 550px) {
    .loader-div {
        background: linear-gradient(to bottom, #a1d1f8, var(--background-color-1));
    }

}

/* Welcome part */
.loading-percentage-parent {
    width: 100vw;
    height: 100dvh;
    background-color: #57677f;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1025;
    display: flex;
    align-items: flex-end;
    justify-content: end;
    padding: 20px;
}

.loading-percentage-child {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);

}

.loading-percentage-text {
    font-size: xx-large;
    text-transform: uppercase;
}

/* Text header */
.loader-text-header {
    font-weight: 600;
    font-size: xxx-large;
}

.loader-text-content {
    font-size: x-large;
}

.no-loaded {
    animation-duration: 1.2s;
}
</style>