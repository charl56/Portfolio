<template>
    <div class="loader-div">
        <p class="loading-percentage-text">Chargement... {{ percentage }}%</p>
    </div>
</template>

<script>
import { gsap } from "gsap";
import dataFR from '../../data/appData/dataFR.json'

export default {
    name: 'AppLoader',
    mounted() {

        // if (window.screen.width > 1000) {
        gsap.from('.loading-percentage-text', {
            duration: 1,
            y: -window.innerHeight,
            stagger: 0.5,
            delay: 0.4,
            ease: "expo.inOut",
        })


        document.documentElement.style.overflow = 'hidden'; // Disable scroll during loading
        this.loadImages(this.appData)
    },
    data() {
        return {
            loaded: false,
            percentage: 0,
            appData: dataFR[1],

        }
    },
    methods: {
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
                                this.percentage = parseInt((progress / totalImages) * 100);
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
                        // When data load : hide loader text
                        gsap.to('.loading-percentage-text', {
                            duration: 1,
                            y: 150,
                            ease: "expo.inOut",
                        })
                            .then(() => {
                                gsap.to('.loading-percentage-text', {
                                    duration: 0,
                                    display: 'none',
                                    ease: "expo.inOut",
                                })
                            })
                            .then(() => {
                                // Then slide to show welcome text
                                gsap.to('.loader-div', {
                                    duration: 1,
                                    y: -window.innerHeight,
                                    ease: "power1.inOut",
                                })
                            })
                            .then(() => {
                                document.documentElement.style.overflow = ''; // Re-enable scroll on html

                            })
                    }, 1000);
                }
            }).catch(error => console.log(error))
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    height: 100dvh;
    width: 100vw;
    background-color: #57677f;

    display: flex;
    align-items: flex-end;
    justify-content: end;

    p {
        margin-right: 10px;
        font-size: xx-large;
        text-transform: uppercase;
    }


}
</style>