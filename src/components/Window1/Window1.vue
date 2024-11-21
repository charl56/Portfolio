<template>
    <div class="window1-div">
        <div v-if="percentage < 101" class="loading-overlay">
            <p class="loading-text">{{ percentage.toFixed(0) }}%</p>
        </div>
        <div v-else v-gif-is-load class="window1-div__gif-scroll">
            <img src="@/assets/gif/scroll_down2.gif" class="gif" />
        </div>
        <p class="window1-p__top" @mouseover="onHoverTop">{{ textTop }}</p>
        <p class="window1-p__bottom" @mouseover="onHoverBottom">{{ textBottom }}</p>
        <Models3dLoader :modelPath="modelPath" :idIs="'model_spacesword'" />
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Models3dLoader from "../Models3dLoader/Models3dLoader.vue";

import dataFR from '../../data/appData/dataFR.json'

export default {
    name: 'Window1',
    components: {
        Models3dLoader
    },
    data() {
        return {
            textTop: "ARE YOU LIVING IN THE REAL WORLD?",
            textBottom: "SEE YOU IN SPACE COWBOY...",
            originalTextTop: "ARE YOU LIVING IN THE REAL WORLD?",
            originalTextBottom: "SEE YOU IN SPACE COWBOY...",
            shuffledTextTop: "",
            shuffledTextBottom: "",
            intervalIdTop: null,
            intervalIdBottom: null,
            isAnimatingTop: false,
            isAnimatingBottom: false,
            modelPath: "../../../../../images/model/swordfish2/scene.gltf",
            // Percentage image loading
            appData: dataFR[1],
            percentage: 0
        }
    },
    mounted() {
        document.documentElement.style.overflow = 'hidden'; // Disable scroll during loading
        this.loadImages(this.appData)

        gsap.registerPlugin(ScrollTrigger);


        // Move texts and rocket during scroll
        gsap.timeline({
            scrollTrigger: {
                trigger: ".window1-div",        // Element where trigger actions
                start: "top top",               // Where trigger start : top of component, top of screen
                end: "bottom top",              // Where trigger end : bottom of component, 70% of top of screen
                pin: true,                      // Stay on component during animations
                scrub: 3,                       // Sscrubbing, takes 3 second to "catch up" to the scrollbar
            }
        })
            .to('.window1-p__top', { y: 200, duration: 1, stagger: 1 })
            .to('#model_spacesword', { x: (window.innerWidth * 0.8), y: (window.innerHeight * 2 ), duration: 1, stagger: 1 }, "<")
            .to('.window1-p__bottom', { y: -200, duration: 1, stagger: 1 }, "<")
            
            .to('.window1-p__top', { y: -200, duration: 1, stagger: 1 })
            .to('#model_spacesword', { visibility: "Hidden", duration: 1, stagger: 1}, "<")
            .to('.window1-p__bottom', { y: -400, duration: 1, stagger: 1 }, "<")




    },
    methods: {
        onHoverTop() {
            if (!this.isAnimatingTop) {
                this.shuffleAndReorganize('Top');
            }
        },
        onHoverBottom() {
            if (!this.isAnimatingBottom) {
                this.shuffleAndReorganize('Bottom');
            }
        },
        shuffleAndReorganize(textType) {
            this[`isAnimating${textType}`] = true;

            // Shuffle instant
            this.shuffleText(textType);

            // Reorganize during 1 sec
            let index = 0;
            const originalText = this[`originalText${textType}`];
            const intervalId = setInterval(() => {
                if (index < originalText.length) {
                    this[`text${textType}`] = originalText.slice(0, index + 1) + this[`shuffledText${textType}`].slice(index + 1);
                    index++;
                } else {
                    clearInterval(this[`intervalId${textType}`]);
                    this[`isAnimating${textType}`] = false;
                }
            }, 1000 / originalText.length);

            this[`intervalId${textType}`] = intervalId;
        },
        shuffleText(textType) {
            const shuffled = this[`text${textType}`].split('').sort(() => 0.5 - Math.random()).join('');
            this[`shuffledText${textType}`] = shuffled;
            this[`text${textType}`] = shuffled;
        },
        calculateTotalImages(data) {
            let totalImages = 0;
            for (const projet of data) {
                if (projet.photos != undefined) {
                    totalImages += 1
                }
            }
            return totalImages;
        },
        loadImages(data) {
            // Get projets in JSON
            let progress = 0; // In %
            this.percentage = 0;
            const totalImages = this.calculateTotalImages(data);

            let promises = []
            for (const projet of data) {
                if (projet.photos != undefined) {
                    const image = projet.photos[0];
                    let img = new Image()
                    if (import.meta.env.DEV) {
                        img.src = new URL('../../../images/' + image.src, import.meta.url).href
                    } else {
                        img.src = 'images/' + image.src
                    }
                    // Loading, with percentage
                    promises.push(
                        new Promise((resolve, reject) => {
                            img.onload = () => {
                                progress++;
                                this.percentage = (progress / totalImages) * 100;
                                resolve();
                            };
                            img.onerror = reject;
                        })
                    );
                }
            }
            // Attente de la fin du chargement de toutes les images
            Promise.all(promises).then(() => {
                if (this.percentage === 100) {
                    setTimeout(() => {
                        this.percentage = 101
                        document.documentElement.style.overflow = ''; // Re-enable scroll on html

                    }, 1000);
                }
            }).catch(error => console.log(error))
        },
    },
    directives: {
        gifIsLoad: {    // Directive will be call when DOM will be displayed
            mounted(el) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: ".window1-div__gif-scroll",
                        start: "end center",
                        end: "top 25%",
                        scrub: 3,
                    }
                })
                    .to('.window1-div__gif-scroll', { opacity: 0, display: "none" });
            }
        }
    }
}
</script>


<style scoped>
p {
    font-size: xx-large;
    font-weight: 600;
    font-style: italic;
}

.window1-div {
    height: 100dvh;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.loading-text {
    color: white;
    font-size: 3rem;
    font-weight: bold;
}

.window1-div__gif-scroll {
    height: auto;
    position: relative;
    top: 45vh;
    display: flex;
    justify-content: center;
    align-items: center;

    img{
        width: 100px;

    }
}

.window1-p__top {
    align-self: flex-start;
    padding: 10px 20px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: start;
    z-index: 22;
}

#model_spacesword {
    width: 100vw;
    height: 100vh;
    top: -100vh;
    left: -40vw;
    position: absolute;
    z-index: 21;
}

.window1-p__bottom {
    align-self: flex-end;
    padding: 10px 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: end;
    z-index: 20;
}


#text span {
    display: inline-block;
}
</style>