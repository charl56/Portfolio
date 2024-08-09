<template>
    <div class="div-table">

        <!-- Lottie animation -->
        <div class="div-scroll-down d-flex align-end justify-center">
            <div id="lottie-scroll-down"></div>
        </div>
        <!-- Scroll horizontal animation -->
        <div class="racesWrapper">
            <div class="races">
                <Images v-for="projet, index in appData" :key="index" :projet="projet" :id="index" />
            </div>
        </div>


        <!-- Popup open project -->
        <Popup />
        <!-- 3D object -->
        <Object />

    </div>
</template>

<script>
// Data
import dataFR from '../../data/appData/dataFR.json'
import dataENG from '../../data/appData/dataENG.json'
// Events
import { eventBus } from '../../plugins/eventBus';
import '../../plugins/body-movin'
// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Component
import Images from './Images/Images.vue'
import Popup from './Images/Popup/Popup.vue'
import Object from './Object/Object.vue';

export default {
    name: 'AppTable',
    components: {
        Images,
        Popup,
        Object
    },
    mounted() { // Lance la fonction au chargement de la page

        document.getElementById("lottie-scroll-down").style.visibility = "hidden";
        // Lottie animation
        bodymovin.loadAnimation({
            container: document.getElementById('lottie-scroll-down'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: new URL('../../assets/Json/scroll-down2.json', import.meta.url).href
        })

        // GSAP hide/show loffie animation
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(".div-scroll-down", {
            scrollTrigger: {
                trigger: ".div-scroll-down",                             // Where it declenche action
                toggleActions: "restart pause reverse pause",       // "list" of action to do
                start: "bottom center ",                             // Where trigger start : center of component, center of screen
                end: "bottom bottom",                                  // Where trigger end : bottom of component, top of screen            
                scrub: 1,                                           // Move every scroll
                pin: true,                                           // Pin the element to the top
                onEnter: () => { },
                onLeave: () => {
                    document.querySelector('.div-scroll-down').style.position = 'absolute';
                    document.querySelector('.div-scroll-down').style.display = 'none';
                },
                onEnterBack: () => { },
                onLeaveBack: () => {
                    document.querySelector('.div-scroll-down').style.position = 'fixed';
                    document.querySelector('.div-scroll-down').style.display = '';
                },
            },
            opacity: 0,
            ease: "none"
        })

        const data = [dataFR[0], dataENG[0]]        // Variable qui est envoyé au composant 'loader', en Fr et Eng
        eventBus.emit("languageLoad", data);
        this.loadImages(dataFR[1])                  // Fonction qui charge les images

        if (window.innerWidth > 1000) {
            // Animation scroll horizontale
            gsap.registerPlugin(ScrollTrigger);
            const races = document.querySelector(".races");

            function getScrollAmount() {
                let racesWidth = races.scrollWidth;
                return -(racesWidth - window.innerWidth + window.innerWidth);
            }
            const tween = gsap.to(races, {
                x: getScrollAmount,
                duration: 3,
                ease: "none",
            });

            ScrollTrigger.create({
                trigger: ".racesWrapper",
                start: "center center",
                end: "bottom top",
                pin: true,
                animation: tween,
                scrub: 0.7,
                invalidateOnRefresh: true,
            })
        }

    },
    data() {
        return {
            appData: '',        // Données affi chées
            other: dataENG,     // Autre langue
            langue: 'Fr',       // Langue actuelle
            percentage: 0,
            scroll: false,      // user pas encore scroll
            iconFlag: null,     // Icons
        }
    },
    methods: {
        toggleLanguage() {
            eventBus.emit('languageChange', this.langue)
            if (this.langue == 'Fr') {
                this.langue = 'Eng'
                this.appData = dataENG[1]
                // this.iconFlag = this.iconENG
            } else {
                this.langue = 'Fr'
                this.appData = dataFR[1]
                // this.iconFlag = this.iconFR
            }
        },
        calculateTotalImages(data) {
            let totalImages = 0;
            for (const projet of data) {
                if (projet.photos != undefined) {
                    totalImages += projet.photos.length;
                }
            }
            return totalImages;
        },
        loadImages(data) {
            // Récupération des projets depuis le fichier JSON
            let progress = 0; // progression du chargement des images
            this.percentage = 0;
            const totalImages = this.calculateTotalImages(data); // Définissez cette fonction pour calculer le nombre total d'images

            let promises = []
            for (const projet of data) {
                if (projet.photos != undefined) {
                    for (const image of projet.photos) {
                        let img = new Image()
                        if (import.meta.env.DEV) {
                            img.src = new URL('../../../images/' + image.src, import.meta.url).href
                        } else {
                            img.src = 'images/' + image.src
                        }
                        // Chargement des photos, pourcentage
                        promises.push(
                            new Promise((resolve, reject) => {
                                img.onload = () => {
                                    progress++;
                                    this.percentage = (progress / totalImages) * 100;
                                    eventBus.emit('progressValue', this.percentage)
                                    resolve();
                                };
                                img.onerror = reject;
                            })
                        );
                    }
                }
            }
            this.appData = data
            // Attente de la fin du chargement de toutes les images
            Promise.all(promises).then(() => {
                // Event bus pour elenver barre de chargement
                eventBus.emit("dataLoad", true);
                // Show scoll down loffie
                setTimeout(() => {
                    document.getElementById("lottie-scroll-down").style.visibility = "visible";
                }, 3000); // 3000 milliseconds = 3 seconds

            }).catch(error => console.log(error))

        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Div total */
.div-table {
    flex-direction: column;
    overflow-x: hidden;
    margin: 0;
    background: var(--background-color-1);
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.div-table::-webkit-scrollbar {
    display: none;
}

/* GIF scroll down */
.div-scroll-down {
    z-index: 1001;
    height: 100vh;
    width: 100vw;
    position: fixed;
    bottom: 0;
}

#lottie-scroll-down {
    height: 45%;
    width: 45%;
}

/* Icons cv and language */
.div-post-header {
    height: auto;
    width: 50vw;
}

.icon-post-header {
    z-index: 1002;
}

.icon-post-header:hover {
    /* cursor: pointer; */
    transform: scale(1.2);
}

/* ----------------------------------------------
 * Generated by Animista on 2023-11-8 9:40:48
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */
.flag {
    animation: swing-in-bottom-fwd 0.5s cubic-bezier(0.470, 0.000, 0.745, 0.715) 0.1s both;
}

@keyframes swing-in-bottom-fwd {
    0% {
        transform: rotateX(100deg);
        transform-origin: bottom;
        opacity: 0;
    }

    100% {
        transform: rotateX(0);
        transform-origin: bottom;
        opacity: 1;
    }
}

.racesWrapper {
    z-index: 1000 !important;
    /* Ajoute de l'espace sur les côtés */

}

@media (min-width: 1000px) {

    /* GSAP Animation scroll horizontale */
    .racesWrapper {
        padding: 0 50vw;
    }

    .races {
        width: fit-content;
        display: flex;
        flex-wrap: nowrap;
    }

}

@media (max-width: 999px) {
    .racesWrapper {}

    .races {
        display: flex !important;
        justify-content: center !important;
        flex-direction: column !important;
    }

    .space-40vh {
        height: 25vh;
    }
}

.space-20vh {
    height: 20vh;
}

.space-40vh {
    height: 40vh;
}
</style>