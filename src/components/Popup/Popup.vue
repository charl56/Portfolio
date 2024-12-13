<template>
    <!-- Inspiration => gallery : https://www.youtube.com/watch?v=v0UoqZJRP5M -->
    <div class="popup-div">
        <div class="popup-div__header">
            <!-- <p class="popup-div__title" v-if="project">{{ project.name }}</p> -->
            <div class="popup-div__button">
                <button @click="$emit('close')">Fermer</button>
            </div>
        </div>

        <div class="preview-img">
            <img src="" alt=""> <!-- Preview image when hover img -->
        </div>
        <div class="gallery"></div>


        <div class="popup-div__content">

            <div v-if="project" class="modal-content text-title">
                <p v-html="project.name"></p>
            </div>
            <div v-if="project" class="modal-content text-intro">
                <p v-html="project.intro"></p>
            </div>
            <div v-if="project" class="modal-content text-description">
                <p v-html="project.description"></p>
            </div>
            <div v-if="project" class="modal-content text-outil">
                <p v-html="project.outil"></p>
                <ul>
                    <li v-for="outil, index in project.outils" :key="index">{{ outil.name }}</li>
                </ul>
            </div>
            <div v-if="project" class="modal-content text-date">
                <p v-html="project.date"></p>
            </div>

        </div>
    </div>
</template>

<script>
// import Photos3d from './Photos3d/Photos3d.vue';
// <div v-if="project" class="popup-photos">
//    <Photos3d :projectName="renameProjectForId(project.name)" :photos="project.photos" />
// </div> 
import { gsap } from "gsap";


export default {
    name: 'Popup',
    components: {
        // Photos3d
    },
    props: {
        project: {
            type: String,
            required: true,
        },
    },
    watch: {
        project: 'initGallery',
    },
    data() {
        return {
            rotationInterval: null,
            progress: 0,
        }
    },
    mounted() {
        document.body.style.overflow = 'hidden';

        this.initGallery();
        this.initRotationInterval();
    },
    beforeUnmount() {
        document.body.style.overflow = 'auto';
    },
    methods: {
        initGallery() {

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

            var imagesSrcs = null;

            if (this.project != null) {
                imagesSrcs = this.project.photos.map(photo => this.getImageUrl(photo.src));
            }


            for (let i = 0; i < 80; i++) {
                const item = document.createElement('div');
                item.classList.add('item');
                item.className = 'item';
                item.style.position = 'absolute';
                item.style.top = '50%';
                item.style.left = '50%';
                item.style.transform = 'translate(-50%, -50%)';
                item.style.width = '45px';
                item.style.height = '60px';
                item.style.margin = '10px';
                item.style.transformStyle = 'preserve-3d';
                item.style.background = '#b0b0b0';
                // item.style.boxShadow = 'rgb(255 255 255) 15px -10px 25px -5px';

                const img = document.createElement('img');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';

                if (imagesSrcs && imagesSrcs.length > 0) {
                    img.src = imagesSrcs[i % imagesSrcs.length]
                }


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
        renameProjectForId(projectName) {
            return projectName.replace(/ /g, '-').toLowerCase()
        }
    }
}
</script>


<style scoped>
.popup-div {
    height: 100vh;
    width: 100vw;
    top: 0;
    left: -100vw;
    position: fixed;

    z-index: 5;
    background-color: var(--popup-first-color);
    /* background: linear-gradient(232deg, #9d9dad 0, #d1d1d2);; */

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup-div__header {
    width: 100%;
    display: flex;
    top: 0;
    height: 5vh;

    position: absolute;

    .popup-div__button {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

}


.popup-div__content {
    position: absolute;
    top: 5vh;
    height: 94vh;
    width: 100%;

    overflow-x: hidden;
    overflow-y: auto;
    perspective: 1500px;

    display: flex;
    flex-direction: row;
}

.preview-img {
    position: relative;
    top: 5vh;

    height: 95vh;
    width: 100%;
    z-index: 0;

    img {
        height: auto;
        width: 70vw;

        position: relative;
        left: 15vw;

        object-fit: cover;
    }
}

.modal-content {
    position: absolute;

    p {
        font-size: 4em;
        color: white;
        text-align: justify;
        padding: 20px 5px;
    }
}

.text-title {
    top: 1vh;
    left: 0vw;
    right: 35vw;
}

.text-intro {
    top: 80vh;
    left: 35vw;
    right: 0vw;
}

.text-description {
    top: 120vh;
    left: 0vw;
    right: 35vw;

    p {
        font-size: 2em;
    }
}

.text-outil {
    top: 180vh;
    left: 35vw;
    right: 0vw;

    p {
        font-size: 2em;
    }
}

.text-date {
    top: 200vh;
    left: 0vw;
    right: 35vw;

    p {
        font-size: 3em;
    }
}


@media (max-width: 768px) {
    .popup-div__content {
        flex-direction: column;
    }

    .text-title {
        left: 0vw;
        right: 0vw;
    }


}

.gallery {
    position: absolute;
    z-index: 10;
    top: 22.5%;
    left: 50%;
    transform-style: preserve-3d;
    transform: translateX(-50%) rotateX(55deg);
}

.item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 60px;
    margin: 10px;
    transform-style: preserve-3d;
    background: #b0b0b0;
    box-shadow: rgb(255 255 255) 15px -10px 25px -5px;
}







.popup-photos {
    height: 100%;
    width: 50%;
}


@media (max-width: 1000px) {
    .popup-photos {
        width: 100% !important;
        height: 50% !important;
    }

}

.popup-div__content::-webkit-scrollbar {
    /* Fond de la barre de scroll */
    width: 12px;
    padding: 5px;
    margin: 5px;
    background-color: var(--popup-third-color);
    border-radius: 10px;
}

.popup-div__content::-webkit-scrollbar-button {
    /* Boutons haut/bas */
    display: none;
}

.popup-div__content::-webkit-scrollbar-thumb {
    /* Bouton de la barre de scroll */
    background-color: var(--popup-second-color);
    border-radius: 10px;
}
</style>