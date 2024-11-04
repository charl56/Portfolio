<template>
    <div class="projects-div" id="projects-div">
        <div class="projects-div__background-color">
            <div class="projects-div__name" v-for="projet, index in appData" :key="index" :projet="projet" :id="index"
                @mouseover="onHoverProject(projet)" @mouseleave="onLeaveProject">
                <p class="projects-p__name" v-random-position v-scramble-text>{{ projet.name }}</p>
            </div>
            <p class="projects-p__title">PROJETS</p>
        </div>

        <svg width="0" height="0">
            <filter id="grain-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch">
                </feTurbulence>
                <feColorMatrix type="saturate" values="0"></feColorMatrix>
            </filter>
        </svg>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dataFR from '../../data/appData/dataFR.json'


export default {
    name: 'Projects',
    data() {
        return {
            appData: dataFR[1]
        }
    },
    mounted() {
        gsap.registerPlugin(ScrollTrigger);

        const projectNames = gsap.utils.toArray('.projects-p__name');

        gsap.timeline({
            scrollTrigger: {
                trigger: ".projects-div",      // Element where trigger actions
                start: "top center",             // Where trigger start : top of component, top of screen
                end: "center center",            // Where trigger end : bottom of component, 70% of top of screen
                pin: true,
                scrub: 1,
            }
        })
            .to('.projects-p__title', { x: window.innerWidth / 2, duration: 3, stagger: 1 })
            .to(projectNames, {
                x: (index, target) => {
                    const initialLeft = parseFloat(target.dataset.initialLeft);
                    const centerPoint = window.innerWidth / 2;

                    // If right, move to the left, else mot to the right
                    return initialLeft > centerPoint ? -400 : 400;
                },
                duration: 3,
                stagger: 0
            }, "<")


    },
    directives: {
        randomPosition: {
            mounted(el) {
                const innerWidth = window.innerWidth;
                const elWidth = el.offsetWidth;
                const diff = innerWidth - elWidth;
                const randomLeft = Math.random() * diff;

                el.style.position = 'relative';
                el.style.left = `${randomLeft}px`;
                el.style.textAlign = 'center';
                // Save distance for gsap animation
                el.dataset.initialLeft = randomLeft;
            }
        },
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

                    const x = (Math.random() * 6) - 3; // -3 to 3px
                    const y = (Math.random() * 6) - 3; // -3 to 3px
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
        onHoverProject(projet) {
            var src = projet.photos[0].src;

            const backgroundElement = document.querySelector('.projects-div__background-color');
            var url;

            if (import.meta.env.DEV) {
                url = new URL('../../../images/' + src, import.meta.url).href
            } else {
                url = 'images/' + src
            }

            // Change l'URL de l'image de fond
            if (backgroundElement) {
                backgroundElement.style.backgroundImage = `url('${url}')`;
            }
        },
        onLeaveProject() {
            const backgroundElement = document.querySelector('.projects-div__background-color');
            backgroundElement.style.backgroundImage = ''; // Delete inline style
        }
    }
}
</script>


<style scoped>
.projects-div {
    height: 100dvh;
    width: 100vw;
    top: -75vh;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    visibility: visible;
    overflow: hidden;

}



.projects-div__background-color {
    background-color: var(--second-color);
    padding: 5px 5px 100px 5px;
    clip-path: polygon(0vh 50vh, 50vw 50vh, 50vw 100vh, 0vh 100vh);

    /* background-image: url("@/assets/background/cowboy-bebop-opening.jpg"); */
    /* background-image: url("@/assets/background/2.jpg"); */
    background-image: url("@/assets/background/aa.png");

    /* Noir et bleu */
    /* filter: grayscale(100%) brightness(40%) contrast(150%) sepia(100%) hue-rotate(190deg) saturate(2s00%); */
    /* filter: invert(74%) sepia(68%) saturate(6376%) hue-rotate(161deg) brightness(94%) contrast(101%); */
    filter: grayscale(100%) contrast(200%) brightness(150%);
    mix-blend-mode: multiply;


    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

}

.projects-div__background-color::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/background/clustered_grain_effect.png');
    background-size: cover;
    /* Ajuste selon la taille souhaitée */
    opacity: 0.05;
    /* Ajuste l'opacité pour contrôler l'intensité du grain */
    pointer-events: none;
    /* Pour que le grain ne bloque pas les interactions */
}



p {
    color: white;
    font-family: 'the_globe';
    letter-spacing: 2px;

    display: inline-block;
    white-space: nowrap;
}

.projects-p__title {
    font-size: xxx-large;
}

.projects-div__name:hover {
    background-color: rgba(240, 248, 255, 0.548);
    cursor: pointer;
}

.projects-p__name {
    font-size: x-large;
    padding-top: 4px;
}
</style>