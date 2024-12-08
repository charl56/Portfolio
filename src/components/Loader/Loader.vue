<template>
    <div class="loader-div">
        <div class="loader-div__horizontal">
            <p v-for="n in 10" :key="n" class="loading-percentage-text">{{ percentage }}</p>
        </div>
        <div class="loader-div__vertical">
            <p v-for="n in 10" :key="n" class="loading-percentage-text">{{ percentage }}</p>
        </div>
        <div class="loader-div__bienvenu">
            <p>Bienvenue</p>
            <p>Bienvenue</p>
        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import dataFR from '../../data/appData/dataFR.json'

export default {
    name: 'AppLoader',
    data() {
        return {
            percentage: 0,
            appData: dataFR[1],
        }
    },
    mounted() {
        this.initLoader();
        this.loadImages(this.appData)
    },

    methods: {
        initLoader() {
            document.documentElement.style.overflow = 'hidden';
        },
        animateLoaderText() {
            // Faire agrandir le text en largeur, pour qu'il passe de width 0 et left 50vw, à width 100vw et left 0. Seulmement pour les balsies p dans la div loader-div__horizontal
            const tl = gsap.timeline({});

            tl.to('.loader-div__horizontal', {
                duration: 0.4,
                stagger: 0.2,
                width: this.percentage + 'vw',
                left: 50 - this.percentage / 2 + 'vw',
                ease: "circ.out",
            }, 0)
                .to('.loader-div__vertical', {
                    duration: 0.4,
                    stagger: 0.2,
                    height: this.percentage + 'vh',
                    top: 50 - this.percentage / 2 + 'vh',
                    ease: "circ.out",
                }, 0);
        },
        loadImages() {
            const totalImages = this.calculateTotalImages();
            const imagePromises = this.createImagePromises(totalImages);

            Promise.all(imagePromises)
                .then(() => this.handleLoadingComplete())
                .catch(error => console.error('Image loading error:', error));
        },
        calculateTotalImages() {
            return this.appData.reduce((total, projet) =>
                total + (projet.photos ? 1 : 0), 0);
        },
        createImagePromises(totalImages) {
            let loadedImages = 0;
            return this.appData.reduce((promises, projet) => {
                if (projet.photos) {
                    const img = new Image();
                    img.src = this.getImageSrc(projet.photos[0].src);
                    promises.push(this.createImageLoadPromise(img, () => {
                        loadedImages++;
                        this.updatePercentage(loadedImages, totalImages);
                    }));
                }
                return promises;
            }, []);
        },
        getImageSrc(imagePath) {
            return import.meta.env.DEV
                ? new URL(`../../../images/${imagePath}`, import.meta.url).href
                : `images/${imagePath}`;
        },
        createImageLoadPromise(img, onLoad) {
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    onLoad();
                    resolve();
                };
                img.onerror = reject;
            });
        },
        updatePercentage(loaded, total) {
            const targetValue = Math.round((loaded / total) * 100);

            // If the target value is the same as the current value, do nothing
            if (this.percentage === targetValue) return;

            const smoothIncrement = setInterval(() => {
                if (this.percentage === targetValue || this.percentage >= 100) {
                    clearInterval(smoothIncrement);
                    return;
                }

                // Update your percentage display here
                this.percentage += 1;

                // Animation to move text with percentage
                this.animateLoaderText();

            }, 20); // Adjust the interval timing as needed
        },
        handleLoadingComplete() {
            // If the percentage is at 100, start text loader animation
            const animateLoaderOut = setInterval(() => {
                if (this.percentage == 100) {
                    setTimeout(this.animateLoaderOut, 400);
                    clearInterval(animateLoaderOut);
                    return;
                }
            }, 20); // Adjust the interval timing as needed
        },
        animateLoaderOut() {
            const tl = gsap.timeline();

            // On ferme la croix
            tl
                .to('.loader-div__horizontal', {
                    duration: 1,
                    width: '0vw',
                    left: '50vw',
                    ease: "expo.inOut",
                })
                .to('.loader-div__vertical', {
                    duration: 1,
                    height: '0',
                    top: '50vh',
                    ease: "expo.inOut",
                }, '<')
                // On prepare affiche fenetre projet
                .to('.projects-div', {
                    duration: 0,
                    clipPath: "inset(50% round 10px)",
                }, "<")
                // On affiche bienvenu
                .to('.loader-div__bienvenu', {
                    duration: 1.8,
                    height: '100vh',
                    top: '0vh',
                    ease: "power3.out",
                }, 0.7)
                // On affiche fenetre projet
                .to('.projects-div', {
                    duration: 1.8,
                    clipPath: "inset(37% round 10px)",
                    ease: "power3.out",
                }, "<")
                // on cache bienvenu
                .to('.loader-div__bienvenu', {
                    duration: 1,
                    height: '0',
                    top: '50vh',
                    ease: "power2.inOut",
                }, 2)
                // On cache fenetre projets
                .to('.projects-div', {
                    duration: 1,
                    clipPath: "inset(50% round 10px)",
                    ease: "power2.inOut",
                }, "<")
                // On affiche le titre des projets, caché
                .to('.projects-div__name', {
                    duration: 0,
                    visibility: 'visible'
                }, 3)
                // On prepare le clip path au milieu de l'ecran
                .to('.projects-div', {
                    duration: 0,
                    clipPath: "inset(50% round 10px)",
                    ease: "power2.inOut",
                }, "<")
                // On agrandi sur tout l'ecran
                .to('.projects-div', {
                    duration: 1,
                    clipPath: "inset(0% round 10px)",
                    ease: "power2.inOut",
                }, "<")
            // Une fois toutes les animations terminées, réactive le scroll
            tl.then(() => {
                document.documentElement.style.overflow = '';
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-div {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;

    height: 100%;
    width: 100vw;
    background-color: #020202;

    p {
        font-size: xx-large;
        text-transform: uppercase;
        height: 10vh;
        width: 10vw;
        text-align: center;
        align-content: center;
    }
}

.loader-div__horizontal {
    height: 100vh;
    width: 0;
    position: absolute;
    top: 0;
    left: 50vw;

    overflow: hidden;

    display: flex;
    flex-direction: row;
    align-items: center;
}

.loader-div__vertical {
    height: 0;
    width: 100vw;
    position: absolute;
    top: 50vh;
    left: 0;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}


.loader-div__bienvenu {
    height: 0;
    width: 100vw;
    position: absolute;
    top: 50vh;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-content: space-evenly;

    p {
        width: auto;
    }

    img {
        border-radius: 4px;
    }
}

/* 

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: wheat;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.overlay-content {
    width: 40%;
}

.images {
    position: relative;
    width: 550px;
}

.img-holder {
    position: relative;
    width: 80%;
    height: 100%;
    margin: 0 auto;
    z-index: 2;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.img-holder img {
    position: absolute;
    top: 0;
    left: -100%;
}

.text {
    position: relative;
    margin: 1em 0;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.counter,
.logo p {
    font-size: 200px;
    text-align: center;
    text-transform: uppercase;
}

.counter p{
    line-height: 100%;
}

.counter p span, .logo p span {
    position: relative;
} */
</style>