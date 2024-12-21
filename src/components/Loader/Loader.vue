<template>
    <!-- Inspiration => Loader effects : https://www.opendue.com/ -->
    <div class="loader-div">
        <div class="loader-div__horizontal">
            <p v-for="n in 2" :key="n" class="loading-percentage-text">{{ percentage }}</p>
        </div>
        <div class="loader-div__vertical">
            <p v-for="n in 2" :key="n" class="loading-percentage-text">{{ percentage }}</p>
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
            projetcs: dataFR[1],
            gallery: dataFR[2],
            images: []
        }
    },
    mounted() {
        this.initLoader();

        this.projetcs.forEach(project => {
            project.photos.forEach(photo => {
                this.images.push(photo.src);
            })
        });

        this.gallery.forEach(img => {
            this.images.push("Gallery" + img.src);
        });

        setTimeout(this.loadImages(), 1000);
    },
    onMounted() {
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
                width: this.percentage + '%',
                left: 50 - this.percentage / 2 + '%',
                ease: "circ.out",
            }, 0)
                .to('.loader-div__vertical', {
                    duration: 0.4,
                    stagger: 0.2,
                    height: this.percentage + '%',
                    top: 50 - this.percentage / 2 + '%',
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
            return this.images.reduce((total, img) =>
                total + (img ? 1 : 0), 0);
        },
        createImagePromises(totalImages) {
            let loadedImages = 0;
            return this.images.reduce((promises, i) => {
                if (i) {
                    const img = new Image();
                    img.src = this.getImageSrc(i);
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

            }, 50); // Adjust the interval timing as needed
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

                // TODO couleur background curor 
                .to('.loader-div__horizontal', {
                    duration: 1,
                    width: '0',
                    left: '50%',
                    ease: "expo.inOut",
                })
                .to('.loader-div__vertical', {
                    duration: 1,
                    height: '0',
                    top: '50%',
                    ease: "expo.inOut",
                }, '<')
                // On prepare affiche fenetre projet
                .to('.projects-div', {
                    duration: 0,
                    clipPath: "inset(50% round 20px)",
                }, "<")


                // On affiche bienvenu
                .to('.loader-div__bienvenu', {
                    duration: 1.4,
                    height: '100%',
                    top: '0',
                    ease: "expo.inOut",
                }, 1)
                // On affiche fenetre projet
                .to('.projects-div', {
                    duration: 1.4,
                    clipPath: "inset(37% round 20px)",
                    ease: "expo.inOut",
                }, "<")

                // on cache bienvenu
                .to('.loader-div__bienvenu', {
                    duration: 1,
                    height: '0',
                    top: '50%',
                    ease: "power2.inOut",
                }, 2.5)
                // On cache fenetre projets
                .to('.projects-div', {
                    duration: 1,
                    clipPath: "inset(50% round 20px)",
                    ease: "power2.inOut",
                }, "<")


                // On affiche le titre des projets, caché
                .to('.projects-div__name', {
                    duration: 0,
                    visibility: 'visible'
                }, 3.5)
                // On prepare le clip path au milieu de l'ecran
                .to('.projects-div', {
                    duration: 0,
                    clipPath: "inset(50% round 20px)",
                }, "<")
                // On remet le filtre du ciel
                .to('.background-images-container', {
                    duration: 0,
                    filter: "invert(1)",
                }, "<")
                // On agrandi sur tout l'ecran
                .to('.projects-div', {
                    duration: 1,
                    clipPath: "inset(0% round 10px)",
                    ease: "power2.inOut",
                }, "<")
                // On enlève totalement le filtre
                .to('.background-images-container', {
                    duration: 1.8,
                    filter: "invert(0)",
                }, "<")
                .to('.cursor-dot-outline', {
                    duration: 1.8,
                    backgroundColor: "var(--cursor-third)",
                    ease: "power2.inOut",
                }, "<")

            // TODO couleur background curor 


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
    height: 100%;
    width: 100vw;
    z-index: 0;

    background-color: #020202;

    p {
        font-size: 3.5em;
        text-transform: uppercase;
        height: 10vh;
        width: auto;
        text-align: center;
        align-content: center;
    }
}

.loader-div__horizontal {
    height: 100%;
    width: 0;
    position: absolute;
    top: 0;
    left: 50%;

    overflow: hidden;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.loader-div__vertical {
    height: 0;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 0;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}


.loader-div__bienvenu {
    height: 0;
    width: 100%;
    position: absolute;
    top: 50%;

    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-content: space-evenly;


    img {
        border-radius: 4px;
    }
}

@media (max-width: 768px) {
    .loader-div {
        p {
            font-size: 2.7em;
        }
    }
}
</style>