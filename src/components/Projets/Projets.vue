<template>
    <!-- Projects display, end animation: https://www.danielspatzek.com/home/ -->
    <!-- Popup open : https://bruut.media/case/stichting-beschermde-wieg/ -->
    <div class="projects-div" id="projects-div">
        <div class="projects-div__background-color">
            <div class="foreground-image"></div>
            <div class="projects-div__name" v-for="projet, index in appData" :key="index" :projet="projet" :id="index"
                @mouseover="onHoverProject(index)" @mouseleave="onLeaveProject" @click="onProjectClick(index)">
                <p class="projects-p__name" v-scramble-text>{{ projet.name }}</p>
            </div>
            <p class="projects-p__title">PROJETS</p>
            <!-- Background image in window -->
            <div class="background-images-container">
                <div class="backround-image default-bg"></div>
                <div v-for="(projet, index) in appData" :key="index"
                    :class="['project-bg', `project-bg-${index}`, { 'active': activeIndex === index }]"
                    :style="getBackgroundStyle(projet)">
                </div>
            </div>
        </div>
        <div class="background__pop-up"></div>
    </div>
    <Popup :project="selectedProject" @close="onCloseProject" />
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import dataFR from '../../data/appData/dataFR.json'

import Popup from "../Popup/Popup.vue";

export default {
    name: 'Projets',
    components: { Popup },
    data() {
        return {
            appData: dataFR[1],
            backgroundElement: null,
            activeIndex: null,
            selectedProject: null,
            projectClickTimeline: null
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        const projectNames = gsap.utils.toArray('.projects-p__name');

        gsap.timeline({
            scrollTrigger: {
                trigger: ".projects-div",      // Element where trigger actions
                start: "top top",             // Where trigger start : top of component, top of screen
                end: "bottom+=600 top",            // Where trigger end : bottom of component, 70% of top of screen
                pin: true,
                scrub: 1,
                preventOverlaps: true,
                // markers: true
            }
        })
            .to('.projects-p__title', { x: window.innerWidth, duration: 3, stagger: 1 })
            .to(projectNames, {
                y: -window.innerHeight,
                duration: 3,
                stagger: 0
            }, "<")
            // Hide background popup
            .to('.background__pop-up', { opacity: 0, duration: 0 })
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
                        offset = 0;
                        offsetMultiple = 0;
                    }

                    const x = (Math.random() * offsetMultiple) - offset; // -3 to 3px
                    const y = (Math.random() * offsetMultiple) - offset; // -3 to 3px
                    span.dataset.x = x;
                    span.dataset.y = y;

                    el.appendChild(span);
                }

                const handleMouseEnter = () => {
                    el.querySelectorAll('span').forEach(span => {
                        const x = span.dataset.x;
                        const y = span.dataset.y;
                        span.style.transform = `translate(${x}px, ${y}px)`;
                    });
                };

                const handleMouseLeave = () => {
                    el.querySelectorAll('span').forEach(span => {
                        span.style.transition = 'transform 0.3s ease';
                        span.style.transform = 'translate(0, 0)';
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
        },
        onProjectClick(index) {
            this.selectedProject = this.appData[index];

            // Disable window scroll
            document.documentElement.style.overflow = 'hidden';

            // Disable ScrollTrigger before animation (mounted)
            ScrollTrigger.getAll().forEach(st => st.disable());

            // Position of projects-div
            const projectsDiv = document.querySelector('.projects-div');
            const projectsDivRect = projectsDiv.getBoundingClientRect();


            const tl = gsap.timeline({
                onComplete: () => {
                    // Enable ScrollTrigger after animation
                    ScrollTrigger.getAll().forEach(st => st.enable());
                }
            });

            // Scroll only if div down of viewport
            tl.to(window, {
                duration: 0.5,
                scrollTo: { y: projectsDiv, offsetY: 0 },
                ease: "power2.inOut"
            }, 0);


            tl
                .to('.projects-div__background-color', {
                    duration: 0.3,
                    scale: 0.96,
                    ease: "power4.out",
                    borderRadius: "10px",
                }, 0, 5)
                .to('.popup-div', {
                    duration: 0.3,
                    scale: 0.96,
                    ease: "power4.out",
                    borderRadius: "10px",
                }, 0, 5)
                .to('.projects-div__background-color', {
                    duration: 0.3,
                    left: innerWidth,
                    ease: "power4.out",
                }, 0.5)
                .to('.popup-div', {
                    duration: 0.3,
                    left: 0,
                    ease: "power4.out",
                }, 0.5)
                .to('.popup-div', {
                    duration: 0.3,
                    scale: 0.98,
                    ease: "power4.out",
                }, 0.8)
                .then(() => {
                });
        },
        onCloseProject() {

            const tl = gsap.timeline();
            tl
                .to(window, {
                    duration: 0.2,
                    scrollTo: { y: ".projects-div", offsetY: 0 },
                    ease: "power2.inOut"
                }, 0)
                .to('.popup-div', {
                    duration: 0.3,
                    scale: 0.96,
                    ease: "power4.out",
                }, 0)
                .to('.projects-div__background-color', {
                    duration: 0.3,
                    left: 0,
                    ease: "power4.out",
                }, 0.5)
                .to('.popup-div', {
                    duration: 0.3,
                    left: -innerWidth,
                    ease: "power4.out",
                }, 0.5)
                .to('.projects-div__background-color', {
                    duration: 0.3,
                    scale: 1,
                    ease: "power4.out",
                    borderRadius: "0px",
                }, 0.8)
                .then(() => {
                    this.selectedProject = null;
                    // Enable window scroll
                    document.documentElement.style.overflow = '';
                })

        }

    }
}
</script>


<style scoped>
.projects-div {
    height: 100dvh;
    width: 100vw;
    z-index: 1;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    clip-path: polygon(50vw 50vh, 50vw 50vh, 50vw 50vh, 50vw 50vh);

}


.projects-div__background-color {
    width: 100%;
    height: 100dvh;
    z-index: 1;

    /* Usefull to move with GSAP */
    position: relative;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 50px 5px;
}



.background__pop-up {
    height: 100dvh;
    width: 100vw;
    top: 0;
    position: fixed;

    z-index: 0;
}




.foreground-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-image: url('@/assets/background/window_open.webp');
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

.backround-image {
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


.project-bg {
    position: absolute;
    top: 17%;
    left: 25%;
    width: 50%;
    height: 72%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 0s ease-in-out;
}


.default-bg {
    background-image: url('@/assets/background/window_sky.webp');
    opacity: 1;
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

.projects-div__name {
    /* Permet de cacher les titres pednant animation loader sur tel */
    visibility: hidden;
}

.projects-div__name:hover {
    cursor: pointer;
}

.projects-p__name {
    font-size: large;
    padding: 4px 0px;
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