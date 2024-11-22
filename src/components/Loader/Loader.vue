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
            this.animateLoaderText();
        },
        animateLoaderText() {
            gsap.from('.loading-percentage-text', {
                duration: 1,
                y: -window.innerHeight,
                stagger: 0.5,
                delay: 0.4,
                ease: "expo.inOut",
            });
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
            this.percentage = Math.round((loaded / total) * 100);
        },
        handleLoadingComplete() {
            if (this.percentage === 100) {
                setTimeout(this.animateLoaderOut, 1000);
            }
        },
        animateLoaderOut() {
            gsap.to('.loading-percentage-text', {
                duration: 1,
                y: 150,
                ease: "expo.inOut",
            }).then(() => {
                gsap.set('.loading-percentage-text', { display: 'none' });
                return gsap.to('.loader-div', {
                    duration: 1,
                    y: -window.innerHeight,
                    ease: "power1.inOut",
                });
            }).then(() => {
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