<template>
    <!-- Inspired by : https://www.danielspatzek.com/home/ -->
    <div class="projects-div" id="projects-div">
        <div class="projects-div__background-color">
            <div class="foreground-image"></div>
            <div class="projects-div__name" v-for="projet, index in appData" :key="index" :projet="projet" :id="index"
                @mouseover="onHoverProject(index)" @mouseleave="onLeaveProject">
                <p class="projects-p__name" v-scramble-text>{{ projet.name }}</p>
            </div>
            <p class="projects-p__title">PROJETS</p>
            <!-- <div class="backround-image"></div> -->
            <div class="background-images-container">
                <div class="backround-image default-bg"></div>
                <div v-for="(projet, index) in appData" :key="index"
                    :class="['project-bg', `project-bg-${index}`, { 'active': activeIndex === index }]"
                    :style="getBackgroundStyle(projet)">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dataFR from '../../data/appData/dataFR.json'


export default {
    name: 'Projets',
    data() {
        return {
            appData: dataFR[1],
            backgroundElement: null,
            activeIndex: null
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);

        const projectNames = gsap.utils.toArray('.projects-p__name');

        gsap.timeline({
            scrollTrigger: {
                trigger: ".projects-div",      // Element where trigger actions
                start: "top top",             // Where trigger start : top of component, top of screen
                end: "bottom+=600 top",            // Where trigger end : bottom of component, 70% of top of screen
                pin: true,
                scrub: 1,
                // markers: true
            }
        })
            .to('.projects-p__title', { x: window.innerWidth, duration: 3, stagger: 1 })
            .to(projectNames, {
                y: -window.innerHeight * 0.8,
                duration: 3,
                stagger: 0
            }, "<")
            // Hide background image
            .to('.backround-image', { opacity: 0, duration: 3 })
            // Zoom into window
            .to('.foreground-image', { scale: 4.5, rotateZ: 15, duration: 3, ease: "none" })


        // Init backgroundElement, where image change onHover
        this.backgroundElement = document.querySelector('.backround-image');

    },
    directives: {

        scrambleText: {
            mounted(el) {
                const parentDiv = el.closest('.projects-div__name') || el.parentElement;
                const text = el.textContent;
                el.textContent = '';

                for (let char of text) {
                    const span = document.createElement('span');
                    if (char === ' ') {
                        span.innerHTML = '&nbsp;'; // html code for space
                    } else {
                        span.textContent = char;
                    }


                    span.style.display = 'inline-block';
                    span.style.position = 'relative';

                    var offset = 3;
                    var offsetMultiple = 6;
                    if (window.innerWidth < 768) {
                        offset = 1;
                        offsetMultiple = 2;
                    }

                    const x = (Math.random() * offsetMultiple) - offset; // -3 to 3px
                    const y = (Math.random() * offsetMultiple) - offset; // -3 to 3px
                    span.dataset.x = x;
                    span.dataset.y = y;
                    span.style.transform = `translate(${x}px, ${y}px)`;

                    el.appendChild(span);
                }

                const handleMouseEnter = () => {
                    el.querySelectorAll('span').forEach(span => {
                        span.style.transition = 'transform 0.3s ease';
                        span.style.transform = 'translate(0, 0)';
                    });
                };

                const handleMouseLeave = () => {
                    el.querySelectorAll('span').forEach(span => {
                        const x = span.dataset.x;
                        const y = span.dataset.y;
                        span.style.transform = `translate(${x}px, ${y}px)`;
                    });
                };

                parentDiv.addEventListener('mouseenter', handleMouseEnter);
                parentDiv.addEventListener('mouseleave', handleMouseLeave);

                el._cleanup = () => {
                    parentDiv.removeEventListener('mouseenter', handleMouseEnter);
                    parentDiv.removeEventListener('mouseleave', handleMouseLeave);
                };
            },
            unmounted(el) {
                if (el._cleanup) {
                    el._cleanup();
                }
            }
        },
    },
    methods: {
        getBackgroundStyle(projet) {
            const src = projet.photos[0].src;
            const url = import.meta.env.DEV
                ? new URL('../../../images/' + src, import.meta.url).href
                : 'images/' + src;

            return {
                backgroundImage: `url('${url}')`
            }
        },
        onHoverProject(index) {
            this.activeIndex = index;
        },
        onLeaveProject() {
            this.activeIndex = null;
        }
    }
}
</script>


<style scoped>
.projects-div {
    height: 100dvh;
    width: 100vw;


    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    visibility: visible;
    overflow: hidden;

}



.projects-div__background-color {
    position: relative;
    overflow: hidden;

    width: 100%;
    height: 100%;
    padding: 50px 5px;

    display: flex;
    flex-direction: column;
    justify-content: center;
}


.foreground-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-image: url('@/assets/background/window_avec_volet.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

}

.background-images-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.backround-image,
.project-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 0s ease-in-out;
}

.default-bg {
    background-image: url('@/assets/background/window.jpg');
    opacity: 1;
}

.project-bg {
    opacity: 0;
}

.project-bg.active {
    opacity: 1;
}


p {
    color: white;
    letter-spacing: 2px;

    display: inline-block;
    white-space: nowrap;
}

.projects-p__title {
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: xxx-large;
}

.projects-div__name:hover {
    cursor: pointer;
}

.projects-p__name {
    font-size: large;
    padding-top: 4px;
    height: 40px;
    font-size: xx-large;
    left: 0;

}

@media (max-width: 768px) {
    .projects-p__name {
        font-size: 1.3em;
    }
}
</style>