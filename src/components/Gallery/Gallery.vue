<template>
    <!-- Inspiration => gallery : https://www.youtube.com/watch?v=v0UoqZJRP5M -->
    <div class="gallery-div" ref="galleryContainer">
        <div class="preview-img">
            <!-- Preview image when hover img -->
            <img alt="image de prevision"> 
        </div>
        <div class="gallery"></div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import dataFR from '../../data/appData/dataFR.json'
import getAssetSrc from '@/utils/imageUtils';

export default {
    name: 'Gallery',
    data() {
        return {
            rotationInterval: null,
            progress: 0,
            imagesWithIndex: null,
            imgsPath: dataFR[2],
            observer: null,
            isVisible: false,
        }
    },
    mounted() {
        this.setupIntersectionObserver();
    },
    methods: {
        setupIntersectionObserver() {
            this.observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && !this.isVisible) {
                        this.isVisible = true;
                        this.initGallery();
                        this.observer.disconnect();
                    }
                },
                {
                    threshold: 0.1
                }
            );
            
            this.observer.observe(this.$refs.galleryContainer);
        },
        initGallery() {

            var imgs = []

            this.imgsPath.forEach(photo => {
                imgs.push(getAssetSrc("Gallery" + photo.src))
                console.log("Gallery" + photo.src)
            });

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
                this.imagesWithIndex = this.project.photos.map(photo => getAssetSrc(photo.src));
            }


            var divWidth = "100px"
            var divheight = "80px"
            if (window.innerWidth < 768) {
                divWidth = "45px"
                divheight = "60px"
            }


            for (let i = 0; i < imgs.length; i++) {
                const item = document.createElement('div');
                // Css class isn't appplied in local
                item.classList.add('item');
                item.className = 'item';
                item.style.position = 'absolute';
                item.style.width = divWidth;
                item.style.height = divheight;
                item.style.margin = '10px';
                item.style.transformStyle = 'preserve-3d';

                const img = document.createElement('img');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '5px';
                img.src = imgs[i];
                img.alt = `Image ${i + 1}`;


                item.appendChild(img);
                gallery.appendChild(item);
            }

            const items = document.querySelectorAll('.item');
            const numberOfItems = items.length;
            const angleIncrement = 360 / numberOfItems;


            var tranformY = "600px"
            if (window.innerWidth < 768) {
                tranformY = "200px"
            }

            items.forEach((item, index) => {
                gsap.set(item, {
                    rotationY: 90,
                    rotationZ: index * angleIncrement - 90,
                    transformOrigin: `50% ${tranformY}`
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
        pauseAnimation() {
            if (this.rotationInterval) {
                clearInterval(this.rotationInterval);
                this.rotationInterval = null;
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
}


/* ************************************* */

.preview-img {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 20vh;

    display: flex;
    justify-content: center;
    align-items: flex-end;

    img {
        height: 80%;
        width: auto;

        position: relative;
        border-radius: 20px;

        object-fit: cover;
    }
}

@media (max-width: 768px) {

    .preview-img {

        img {
            height: auto;
            width: 80%;
        }
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
}
</style>