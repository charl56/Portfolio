<template>
    <!-- Inspiration => gallery : https://www.youtube.com/watch?v=v0UoqZJRP5M -->
    <div class="gallery-div" v-observe-visibility="handleVisibility">
        <div class="preview-img">
            <img src="" alt=""> <!-- Preview image when hover img -->
        </div>
        <div class="gallery"></div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import dataFR from '../../data/appData/dataFR.json'

export default {
    name: 'Gallery',
    data() {
        return {
            rotationInterval: null,
            progress: 0,
            imagesWithIndex: null,
            appData: dataFR[1],
        }
    },
    mounted() {
        this.initGallery();
    },
    directives: {
        observeVisibility: {
            mounted(el, binding) {
                const observer = new IntersectionObserver((entries) => {
                    const isVisible = entries[0].isIntersecting;
                    if (binding.value) binding.value(isVisible);
                }, {
                    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
                });
                observer.observe(el);
            },
            unmounted(el) {
                // Nettoyer l'observer
                if (el._observer) {
                    el._observer.disconnect();
                }
            }
        }
    },
    methods: {
        initGallery() {

            const projects = this.appData;

            const imgs = projects[0].photos.map(photo => this.getImageUrl(photo.src));

            const gallery = document.querySelector('.gallery');
            const previewImage = document.querySelector('.preview-img img');

            // Clean elements
            gallery.innerHTML = "";
            previewImage.innerHTML = "";
            previewImage.style.visibility = "hidden";

            document.addEventListener("mousemove", function (e) {
                const x = e.clientX;
                const y = e.clientY;

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                const rotateX = 55 + percentY * 2;
                const rotateY = percentX * 2;

                gsap.to(gallery, {
                    duration: 1,
                    ease: "power2.out",
                    rotateX: rotateX,
                    rotateY: rotateY,
                    overwrite: "auto"
                });
            });


            this.imagesWithIndex = null;

            if (this.project != null) {
                this.imagesWithIndex = this.project.photos.map(photo => this.getImageUrl(photo.src));
            }



            for (let i = 0; i < 80; i++) {
                const item = document.createElement('div');
                item.classList.add('item');
                item.className = 'item';
                item.style.position = 'absolute';
                item.style.width = '45px';
                item.style.height = '60px';
                item.style.margin = '10px';
                item.style.transformStyle = 'preserve-3d';

                const img = document.createElement('img');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '5px';
                img.src = imgs[i % imgs.length]


                item.appendChild(img);
                gallery.appendChild(item);
            }

            const items = document.querySelectorAll('.item');
            const numberOfItems = items.length;
            const angleIncrement = 360 / numberOfItems;


            items.forEach((item, index) => {
                gsap.set(item, {
                    rotationY: 90,
                    rotationZ: index * angleIncrement - 90,
                    transformOrigin: "50% 300px"
                });

                item.addEventListener("mouseover", () => {
                    const imgInsideItem = item.querySelector('img');
                    previewImage.src = imgInsideItem.src;
                    previewImage.style.visibility = "visible";

                    clearInterval(this.rotationInterval);

                    gsap.to(item, {
                        x: 10,
                        y: 10,
                        z: 10,
                        ease: "power2.out",
                        duration: 0.5
                    });
                });

                item.addEventListener("mouseout", () => {
                    previewImage.style.visibility = "hidden";

                    this.initRotationInterval();

                    gsap.to(item, {
                        x: 0,
                        y: 0,
                        z: 0,
                        ease: "power2.out",
                        duration: 0.5
                    });

                });
            });
            this.initRotationInterval();
        },
        handleVisibility(isVisible) {
            this.isVisible = isVisible;
            if (isVisible) {
                this.resumeAnimation();
            } else {
                this.pauseAnimation();
            }
        },
        pauseAnimation() {
            if (this.rotationInterval) {
                clearInterval(this.rotationInterval);
                this.rotationInterval = null;
            }
        },
        resumeAnimation() {
            if (!this.rotationInterval) {
                this.initRotationInterval();
            }
        },
        initRotationInterval() {
            this.rotationInterval = setInterval(() => {
                const items = document.querySelectorAll('.item');

                this.progress += 0.001;

                const rotationProgress = this.progress * 360;        // O to 1
                const numberOfItems = items.length;             // Up, set to 80 
                const angleIncrement = 360 / numberOfItems;     // 4.5


                items.forEach((item, index) => {
                    // Current angle ~ degres where to go, from same origin to every one
                    const currentAngle = index * angleIncrement - 90 + rotationProgress;

                    gsap.to(item, {
                        rotateZ: currentAngle,
                        duration: 1,
                        overwrite: "auto"
                    });
                });
            }, 50);
        },
        getImageUrl(src) {
            return import.meta.env.DEV
                ? new URL(`../../../images/${src}`, import.meta.url).href
                : `images/${src}`;
        },
    },
    beforeDestroy() {
        this.pauseAnimation();
    }
}
</script>


<style scoped>
.gallery-div {
    position: relative;
    width: 100vw;
    height: 50vh;
    top: -50vh;

    z-index: 5;

    /* display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; */
}


/* ************************************* */

.preview-img {
    height: 100vh;
    width: 100vw;
    position: absolute;

    display: flex;
    justify-content: center;
    align-items: flex-end;

    img {
        height: 60vh;
        width: 60vw;

        position: relative;
        border-radius: 20px;

        object-fit: cover;
    }
}

.gallery {
    position: relative;
    height: 100vh;
    width: 100vw;

    transform-style: preserve-3d;
    transform: rotateX(55deg);
    z-index: 10;

    display: flex;
    justify-content: center;

}

.item {
    position: absolute;
    width: 45px;
    height: 60px;
    margin: 10px;

    transform-style: preserve-3d;
    background: #b0b0b0;
    box-shadow: rgb(255 255 255) 15px -10px 25px -5px;
}


.gallery-div__content::-webkit-scrollbar {
    /* Fond de la barre de scroll */
    width: 10px;
    background-color: var(--popup-first-color);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

.gallery-div__content::-webkit-scrollbar-button {
    /* Boutons haut/bas */
    display: none;
}

.gallery-div__content::-webkit-scrollbar-thumb {
    /* Bouton de la barre de scroll */
    background-color: var(--popup-second-color);
    border-radius: 10px;
    /* border-top-right-radius: 10px;
    border-bottom-right-radius: 10px; */
}
</style>