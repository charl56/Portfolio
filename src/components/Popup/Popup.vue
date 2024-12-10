<template>
    <!-- Inspiration => galerry : https://www.youtube.com/watch?v=v0UoqZJRP5M -->
    <div class="popup-div">
        <div class="popup-div__header">
            <p class="popup-div__title" v-if="project">{{ project.name }}</p>
            <div class="popup-div__button">
                <button @click="$emit('close')">Fermer</button>
            </div>
        </div>
        <div class="popup-div__content">
            <!-- <div class="container"> -->
                <div class="preview-img">
                    <img src="" alt="">
                    <!-- <img src="@/assets/background/zoro.webp" alt=""> -->
                    <div v-if="project" class="modal-content__text">
                        <!-- Intro -->
                        <p v-html="project.intro"></p>
                        <!-- Description -->
                        <p v-html="project.description"></p>
                        <!-- Liste des outils utilisés -->
                        <p v-html="project.outil"></p>
                        <ul>
                            <li v-for="outil, index in project.outils" :key="index">{{ outil.name }}</li>
                        </ul>
                        <!-- Dates -->
                        <p>{{ project.date }}</p>
                    </div>
                </div>

                <div class="gallery"></div>
            <!-- </div> -->
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
    mounted() {
        document.body.style.overflow = 'hidden';
        this.initGallery();
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

            if(this.project != null){
                imagesSrcs = this.project.photos.map(photo => this.getImageUrl(photo.src));
            }


            for (let i = 0; i < 80; i++) {
                const item = document.createElement('div');
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

                const img = document.createElement('img');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';

                if(imagesSrcs && imagesSrcs.length > 0){
                    console.log(i, i % imagesSrcs.length)
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

                    // gallery.style.opacity = 0.5;    

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

                    // gallery.style.opacity = 1;    


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
    height: 100dvh;
    width: 100vw;
    top: 0;
    left: -100vw;
    position: fixed;

    z-index: 5;
    background-color: var(--popup-first-color);


    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.popup-div__header {
    width: 100%;
    display: flex;

    position: relative;

    .popup-div__title {
        width: 80%;
        font-size: xxx-large;
        text-align: left;
        margin-left: 10px;
    }

    .popup-div__button {
        width: 20%;
        display: flex;
        justify-content: flex-end;
    }

}


.popup-div__content {
    height: -webkit-fill-available;
    width: 100%;
    overflow-y: auto;
    margin-top: 10px;
    perspective: 1500px;

    display: flex;
    flex-direction: row;

    p {
        height: auto;
        padding: 20px 20px 200px;
    }
}


/* .modal-content__text {
    height: auto;
    width: 40%;
    display: flex;
    flex-direction: column;
} */

/* .modal-content__galery {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
} */

@media (max-width: 768px) {
    .popup-div__content {
        flex-direction: column;
    }

    /* .modal-content__text {
        height: 40%;
        width: 100%;
    } */

    /* .modal-content__galery { 
        height: 60%;
        width: 100%;
    } */
}

/* .container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    perspective: 1500px;
} */

.gallery {
    position: absolute;
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
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-img {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: 300px;
    height: 200px; */
    width: fit-content;
    height: 80%;
    z-index: 0;
}



/* .modal-content__image {
    height: 100px;
    width: fit-content;
} */


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